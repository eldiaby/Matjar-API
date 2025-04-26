// ==========================
// IMPORTS & DEPENDENCIES
// ==========================
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection

// ==========================
// DATABASE CONNECTION
// ==========================
const uriFromEnv = process.env.ATLAS_DB_URI?.replace(
  '<db_username>', // Replace <db_username> with your MongoDB Atlas username
  process.env.ATLAS_DB_USERNAME // MongoDB Atlas username from env variables
)
  .replace('<db_password>', process.env.ATLAS_DB_PASSWORD) // Replace <db_password> with your password
  .replace('<project_name>', process.env.ATLAS_DB_PROJECT); // Replace <project_name> with your MongoDB project name

// Local MongoDB URI configuration
const localUri = process.env.LOCAL_DB_URI?.replace(
  '<project_name>', // Replace <project_name> with your MongoDB project name in the local URI
  process.env.ATLAS_DB_PROJECT // The actual project name from env variables
);

// ==========================
// CONNECT DATABASE FUNCTION
// ==========================
/**
 * Connects to MongoDB (either Atlas or local based on config).
 * @param {string} uri - The MongoDB connection URI
 */
const connectDB = async (
  uri = process.env.DB_CONNECTION === 'atlas' ? uriFromEnv : localUri
) => {
  try {
    if (!uri) throw new Error('❌ No valid MongoDB URI found.');

    // Log which MongoDB source is being connected to (Atlas or Local)
    console.log(
      `Connecting to ${
        uri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'
      }...`
    );

    // Connect to the MongoDB database
    await mongoose.connect(uri);
    console.log('Database connection established successfully!');
  } catch (error) {
    // Log any connection errors
    console.error('Failed to connect to the database:', error.message);
    throw error; // Rethrow the error to handle it in other parts of the app
  }
};

// ==========================
// EXPORT MODULE
// ==========================
module.exports = connectDB; // Export the connectDB function for use in other files

// ==========================
// IMPORTS & DEPENDENCIES
// ==========================
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection

// ==========================
// GET MONGO URI HELPER
// ==========================
/**
 * Builds and returns the correct MongoDB URI based on the environment.
 * In development, it returns the local URI with the project name.
 * In production, it returns the full Atlas URI with credentials and project.
 *
 * @returns {string} MongoDB connection string
 */
const getMongoUri = () => {
  if (process.env.NODE_ENV === 'development') {
    // Local MongoDB URI (with project name substitution)
    return process.env.LOCAL_DB_URI?.replace(
      '<project_name>',
      process.env.ATLAS_DB_PROJECT
    );
  }

  // MongoDB Atlas URI (with credentials and project name)
  return process.env.ATLAS_DB_URI?.replace(
    '<db_username>',
    process.env.ATLAS_DB_USERNAME
  )
    .replace('<db_password>', process.env.ATLAS_DB_PASSWORD)
    .replace('<project_name>', process.env.ATLAS_DB_PROJECT);
};

// ==========================
// CONNECT DATABASE FUNCTION
// ==========================
/**
 * Connects to MongoDB using Mongoose.
 * Chooses between local and Atlas URIs based on NODE_ENV.
 *
 * @param {string} [uri] - Optional custom MongoDB URI (defaults to computed value)
 * @returns {Promise<void>}
 */
const connectDB = async (uri = getMongoUri()) => {
  try {
    if (!uri) throw new Error('❌ No valid MongoDB URI found.');

    // Log which MongoDB source is being used
    console.log(
      `Connecting to ${
        uri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'
      }...`
    );

    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log('Database connection established successfully!');
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    throw error;
  }
};

// ==========================
// EXPORT MODULE
// ==========================
module.exports = connectDB;

const mongoose = require(`mongoose`);

const uriFromEnv = undefined;
// process.env.ATLAS_DB_URI?.replace(
// '<db_username>',
// process.env.ATLAS_DB_USERNAME
// );
// .replace('<db_password>', process.env.ATLAS_DB_PASSWORD)
// .replace('<project_name>', process.env.ATLAS_DB_PROJECT);

const localUri = process.env.LOCAL_DB_URI?.replace(
  '<project_name>',
  process.env.ATLAS_DB_PROJECT
);

const connectDB = async (uri = uriFromEnv || localUri) => {
  try {
    if (!uri) throw new Error('❌ No valid MongoDB URI found.');

    console.log(
      `Connecting to ${
        uri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB'
      }...`
    );
    await mongoose.connect(uri);
    console.log('Database connection established successfully!');
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    throw error;
  }
};

module.exports = connectDB;

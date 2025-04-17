const mongoose = require('mongoose');

// const URI = process.env.DBCONECTSTRING.replace(
//   '<db_username>',
//   process.env.DB_USERNAME
// )
//   .replace('<db_password>', process.env.DB_PASSWORD)
//   .replace('<project_name>', process.env.PROJECT_NAME);

const URI_LOCAL = process.env.DBCONECTSTRING_LOCAL.replace(
  '<project_name>',
  process.env.PROJECT_NAME
);

const connectDB = (uri = URI || URI_LOCAL) => {
  console.log('Establishing a connection to the database...');

  // mongoose.connection.once('open', () => {
  //   console.log('Database connected successfully!');
  // });

  // mongoose.connection.on('error', (err) => {
  //   console.log('Error connecting to the database:', err);

  return mongoose.connect(uri); // });
};

module.exports = connectDB;

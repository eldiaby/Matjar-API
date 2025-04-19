require(`dotenv`).config({ path: `./../config.env` });
const mongoose = require('mongoose');
const connectDB = require('./../db/server.js'); // اتصال قاعدة البيانات
const User = require('./../models/userModel.js'); // موديل المستخدم
const users = require('./users.js'); // استيراد بيانات المستخدمين

// دالة للتأكد من الاتصال بقاعدة البيانات
const insertUsers = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await connectDB();
    console.log(`Read ${users.length} users from the file`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`Inserting user ${i + 1}:`, user.email);

      try {
        // إدخال المستخدم باستخدام insertOne بدلاً من bulkWrite
        await User.create(user);
        console.log(`User ${i + 1} (${user.email}) inserted successfully`);
      } catch (err) {
        console.error(`Error inserting user ${i + 1} (${user.email}):`, err);
      }
    }

    // إغلاق الاتصال بعد إدخال جميع البيانات
    mongoose.connection.close();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

// استدعاء الدالة
insertUsers();

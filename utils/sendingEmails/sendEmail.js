// ==========================
// 📧 EMAIL CONFIGURATION
// ==========================
const nodemailer = require('nodemailer');
const nodemailerConfing = require('./nodemailerConfig.js');

// 🔐 Replace credentials with your actual SMTP info (Mailtrap or production)
const transporter = nodemailer.createTransport(nodemailerConfing);

// ==========================
// 📤 SEND EMAIL FUNCTION
// ==========================

/**
 * @desc Sends an email from Matjar.com to specified recipient
 * @param {Object} options - Email sending options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Subject line of the email
 * @param {string} options.html - HTML content of the email
 */
const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || `Matjar.com <no-reply@matjar.com>`,
    to,
    subject: subject || '📦 Message from Matjar.com',
    html: html || '<p>Thanks for contacting Matjar!</p>',
  });

  console.log('✅ Email sent:', info.messageId);
};

module.exports = sendEmail;

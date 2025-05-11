const sendEmail = require('./sendEmail.js');

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verificationLink = `${process.env.FRONTEND_ORIGIN}/verify-email?token=${verificationToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>Welcome to Matjar, ${name}</h2>
      <p>Thank you for signing up! To activate your account, please verify your email by clicking the button below:</p>
      <a href="${verificationLink}" 
         style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
      <p>If you did not create this account, you can ignore this email.</p>
      <br/>
      <p>– The Matjar Team 🛍️</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Matjar – Verify Your Email Address',
    html,
  });
};

module.exports = sendVerificationEmail;

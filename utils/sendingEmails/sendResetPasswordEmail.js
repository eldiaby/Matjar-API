const sendEmail = require('./sendEmail.js');

const sendResetPasswordEmail = async ({ name, email, resetToken }) => {
  const resetLink = `${process.env.FRONTEND_ORIGIN}/reset-password?token=${resetToken}&email=${email}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6">
      <h2>Hello ${name},</h2>
      <p>We received a request to reset your password for your Matjar account.</p>
      <p>To reset your password, please click the button below:</p>
      <a href="${resetLink}" 
         style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <br/>
      <p>– The Matjar Team 🛍️</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Matjar – Reset Your Password',
    html,
  });
};

module.exports = sendResetPasswordEmail;

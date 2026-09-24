const nodemailer = require('nodemailer');

const requiredSettings = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM'];

const getTransporter = () => {
  const missing = requiredSettings.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw { status: 503, message: 'Password recovery email is not configured.' };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendPasswordResetCode = async (email, code) => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'EduNova password reset code',
    text: `Your EduNova password reset code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
  });
};

module.exports = { sendPasswordResetCode };

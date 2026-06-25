import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      'Email credentials not configured. Set EMAIL_USER and EMAIL_PASS in your .env file.\n' +
      'Use a Gmail App Password — see: https://myaccount.google.com/apppasswords'
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: `${process.env.EMAIL_FROM_NAME || 'Smart Society'} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Email sent successfully to %s | Message ID: %s', options.email, info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email to %s:', options.email, error.message);
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      throw new Error(
        'Gmail authentication failed. Make sure:\n' +
        '1. EMAIL_USER is your full Gmail address (e.g. you@gmail.com)\n' +
        '2. EMAIL_PASS is a Gmail App Password (not your normal Gmail password)\n' +
        '3. 2-Step Verification is enabled on your Google account\n' +
        'Generate an App Password at: https://myaccount.google.com/apppasswords'
      );
    }
    throw error;
  }
};

export default sendEmail;

const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail({ to, subject, text, html, attachments = [], cc }) {
  try {
    console.error('process.env.MAIL_HOST', process.env.MAIL_HOST);
    console.error('process.env.MAIL_PORT', process.env.MAIL_PORT);
    console.error('process.env.MAIL_SERVICE', process.env.MAIL_SERVICE);
    console.error('process.env.MAIL_USERNAME', process.env.MAIL_USERNAME);
    console.error('process.env.MAIL_PASSWORD', process.env.MAIL_PASSWORD);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const params = {
      from: '"TravelGO 👻" <WanderGid>',
      to,
      subject,
      text,
      html,
    };

    if (cc) {
      params.cc = cc;
    }

    if (attachments.length) {
      params.attachments = attachments;
    }

    const info = await transporter.sendMail(params);

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

const sendErrorEmail = async (error) => {
  try {
    await sendEmail({
      to: ['matevosyan.2011@gmail.com', 'armann.davtyan@gmail.com'],
      subject: 'API error!',
      text: error.message,
      html: `<h1>${error}</p>`,
    });
  } catch (error) {
    console.log('sendErrorEmail function catch', error);
  }
};

module.exports = {
  sendEmail,
  sendErrorEmail,
};

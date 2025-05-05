const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      service: process.env.MAIL_SERVICE,
      ignoreTLS: true,
      socketTimeout: 10000,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"TravelGO 👻" <WanderGid>',
      to,
      subject,
      text,
      html,
    });

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

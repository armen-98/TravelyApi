const { sequelize, User, File } = require('../models');
const path = require('path');
const fs = require('fs');
const { sendErrorEmail } = require('../services/nodemiler');

const uploadMedia = async (req, res) => {
  let transaction;
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: res.__('no_file') });
    }
    const file = req.files[0];

    transaction = await sequelize.transaction({ autocommit: false });
    const user = await User.findByPk(req.user.id, { sequelize });

    const filePath = path.join(
      path.resolve(),
      `public/contact-us/${user.id}`,
      file.originalname,
    );

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, file.buffer);

    const attachment = await File.findOne({
      where: {
        FileableId: user.id,
        FileableType: 'contact-us',
      },
      transaction,
    });

    if (attachment) {
      await attachment.destroy({ transaction });
      fs.unlinkSync(attachment.path);
    }

    await File.create(
      {
        name: file.originalname,
        path: filePath,
        FileableId: user.id,
        FileableType: 'contact-us',
      },
      { transaction },
    );

    await transaction.commit();
    return res.status(200).json({
      data: {},
      message: res.__('success_message'),
    });
  } catch (e) {
    console.log('Catch error for uploadMedia for contact us', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

const sendEmailMessage = async (req, res) => {
  try {
    const { description } = req.body;
    const { user } = req;
    const file = await File.findOne({
      where: {
        FileableId: user.id,
        FileableType: 'contact-us',
      },
    });
    let attachments = [];

    if (fs.existsSync(file?.path)) {
      attachments = [
        {
          filename: file.name,
          path: file.path,
        },
      ];
    }

    const sendEmail = require('../services/nodemiler').sendEmail;
    await sendEmail({
      to: process.env.SUPPORT_EMAIL_ADDRESS,
      subject: res.__('contact_us_subject'),
      text: description,
      attachments,
    });

    if (file && attachments.length) {
      fs.unlinkSync(file.path);
      await file.destroy();
    }

    return res.status(200).json({
      message: res.__('success_message'),
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(error);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

module.exports = {
  uploadMedia,
  sendEmailMessage,
};

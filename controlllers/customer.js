const { User, File, Customer, sequelize } = require('../models');
const path = require('path');
const fs = require('fs');
const { sendErrorEmail } = require('../services/nodemiler');
const { updateProfile } = require('../validations/customer');

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
      `public/avatar/${user.id}`,
      file.originalname,
    );

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, file.buffer);

    const avatar = await File.findOne({
      where: {
        FileableId: user.id,
        FileableType: 'avatar',
      },
      transaction,
    });

    if (avatar) {
      fs.unlinkSync(avatar.path);
      await avatar.destroy({ transaction });
    }

    await File.create(
      {
        name: file.originalname,
        path: filePath,
        FileableId: user.id,
        FileableType: 'avatar',
      },
      { transaction },
    );
    const customer = await Customer.findOne({
      where: { userId: user.id },
      transaction,
    });
    await customer.update({ image: filePath }, { transaction });
    await customer.reload({ transaction });
    await transaction.commit();
    return res.status(200).json({
      data: { ...user.dataValues, ...customer.dataValues },
      message: res.__('success_message'),
    });
  } catch (e) {
    console.log('Catch error for uploadMedia', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

const updateUserProfile = async (req, res) => {
  let transaction;
  try {
    const { error, value } = updateProfile(req.body || {}, res.__);
    transaction = await sequelize.transaction({ autocommit: false });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findByPk(req.user.id, {
      include: { model: Customer, as: 'customer' },
      transaction,
    });
    if (!user) {
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    await user.customer.update(value, { transaction });

    await transaction.commit();

    return res.status(200).json({
      data: user,
      message: res.__('profile_update_success'),
    });
  } catch (e) {
    console.log('Catch error for updateUserProfile', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  } finally {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
  }
};

module.exports = {
  uploadMedia,
  updateUserProfile,
};

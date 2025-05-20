const { File, sequelize } = require('../models');
const { sendErrorEmail } = require('../services/nodemiler');
const path = require('path');
const fs = require('fs');

const { User } = require('../models');
const { updateProfile } = require('../validations/customer');

// Get user profile
const getUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};

// TODO: NEED WE THIS PART ARMEN?
// Update user profile
// const updateProfile = async (req, res) => {
//   try {
//     console.log(req.user, 'req.user');
//     const userId = req.user.id; // Assuming user ID is available from auth middleware
//     const { firstName, lastName, description, image } = req.body;
//
//     const user = await User.findByPk(userId);
//
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }
//
//     // Update user fields
//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (description) user.description = description;
//     if (image) user.image = image;
//
//     // Update name if first or last name changed
//     if (firstName || lastName) {
//       user.name =
//         `${firstName || user.firstName} ${lastName || user.lastName}`.trim();
//     }
//
//     await user.save();
//
//     res.status(200).json({
//       success: true,
//       message: 'Profile updated successfully',
//       data: {
//         id: user.id,
//         name: user.name,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         image: user.image,
//         description: user.description,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update profile',
//       error: error.message,
//     });
//   }
// };

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
        url: filePath,
        FileableId: user.id,
        FileableType: 'avatar',
        type: 'avatar',
      },
      { transaction },
    );
    await user.update({ image: filePath }, { transaction });
    await user.reload({ transaction });

    await transaction.commit();

    return res.status(200).json({
      data: user,
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
      transaction,
    });
    if (!user) {
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    await user.update(value, { transaction });

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
  getUser,
  updateUserProfile,
  uploadMedia,
};

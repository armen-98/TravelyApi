const { sendErrorEmail } = require('../services/nodemiler');
const jwt = require('jsonwebtoken');
const { User, Role, Customer, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const isValidEmail = (email) => {
  return validator.isEmail(email);
};

function validateUsername(username) {
  if (!validator.isLength(username, { min: 3, max: 20 })) {
    return 'username_length';
  }
  if (!validator.matches(username, /^[a-zA-Z0-9._]+$/)) {
    return 'username_invalid_format';
  }
  return false;
}

const signUp = async (req, res) => {
  let transaction;
  try {
    const { email, username, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: res.__('invalid_email') });
    }
    const usernameError = validateUsername(username);
    if (usernameError) {
      return res.status(400).json({ message: res.__(usernameError) });
    }
    transaction = await sequelize.transaction({ autocommit: false });
    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ message: res.__('exist_email') });
    }

    const existingUsername = await User.findOne({
      where: { username },
      transaction,
    });
    if (existingUsername) {
      await transaction.rollback();
      return res.status(400).json({ message: res.__('exist_username') });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let role = await Role.findOne({ where: { name: 'customer' }, transaction });

    if (!role) {
      role = await Role.create(
        {
          name: 'customer',
        },
        { transaction },
      );
    }

    if (!role) {
      await transaction.rollback();
      return res.status(400).json({
        message: res.__('invalid_role'),
      });
    }

    const newUser = await User.create(
      {
        email,
        username,
        password: hashedPassword,
        roleId: role.id,
      },
      { transaction },
    );

    if (!newUser) {
      await transaction.rollback();
      return res.status(400).json({
        message: res.__('user_not_created'),
      });
    }

    const customer = await Customer.create(
      {
        userId: newUser.id,
        location: 'AM',
        language: 'hy',
        name: '',
        image: '',
        url: '',
        level: 0,
        description: '',
        tag: '',
        rate: 0,
        comment: 0,
        total: 0,
      },
      { transaction },
    );

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    delete newUser.password;
    await transaction.commit();
    return res.status(201).json({
      data: {
        token,
        user: {
          ...newUser,
          ...customer,
        },
      },
      message: req.__('register_success'),
    });
  } catch (e) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log('Catch error for signUp', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const usernameError = validateUsername(username);
    if (usernameError) {
      return res.status(400).json({ message: res.__(usernameError) });
    }

    const user = await User.findOne({
      where: { username },
      include: { model: Customer, as: 'customer' },
    });
    if (!user) {
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: res.__('invalid_password') });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    // const otp = crypto.randomInt(100000, 999999).toString();
    // await user.update({ otp });
    // await user.reload();
    // const sendEmail = require('../services/nodemiler').sendEmail;
    // await sendEmail({
    //   to: user.email,
    //   subject: res.__('password_subject'),
    //   text: `${otp} - ${res.__('otp_sent_success')}`,
    // });

    delete user.password;
    return res.status(200).json({
      data: {
        token,
        user: {
          ...user.dataValues,
          ...user.customer.dataValues,
        },
      },
      message: res.__('login_success'),
    });
  } catch (e) {
    console.log('Catch error for signIn', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

const tokenValidate = async (req, res) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).json({ message: res.__('access_denied') });
    }
    let decoded;
    try {
      decoded = jwt.verify(
        token.replace('Bearer ', ''),
        process.env.JWT_SECRET,
      );
    } catch (e) {
      if (e.message === 'jwt expired') {
        return res.status(401).json({ message: res.__('token_expired') });
      }
    }
    const user = await User.findOne({
      where: { id: decoded.id },
      include: { model: Customer, as: 'customer' },
    });
    if (!user) {
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    return res.status(200).json({
      data: {
        user: {
          ...user.dataValues,
          ...user.customer.dataValues,
        },
      },
      code: 'jwt_auth_valid_token',
      message: res.__('token_validate_success'),
    });
  } catch (e) {
    console.log('Catch error for tokenValidate', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

const getAuthUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: { model: Customer, as: 'customer' },
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      data: {
        user: {
          ...user.dataValues,
          ...user.customer.dataValues,
        },
        token,
      },
      message: res.__('success_message'),
    });
  } catch (e) {
    console.log('Catch error for getAuthUser', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

const forgotPassword = async (req, res) => {
  let transaction;
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: res.__('invalid_email') });
    }

    transaction = await sequelize.transaction({ autocommit: false });
    const user = await User.findOne({ where: { email }, transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    await User.update(
      { otp, otpExpiration },
      { where: { email }, transaction },
    );

    const sendEmail = require('../services/nodemiler').sendEmail;
    await sendEmail({
      to: email,
      subject: res.__('password_subject'),
      text: `${otp} - ${res.__('otp_sent_success')}`,
    });
    await transaction.commit();
    return res.status(200).json({
      message: res.__('otp_sent'),
      data: {
        code: otp,
      },
    });
  } catch (e) {
    console.log('Catch error for forgotPassword', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }

    if (transaction) {
      await transaction.rollback();
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

const verifyOtp = async (req, res) => {
  let transaction;
  try {
    const { username, email, code } = req.body;

    if (!username && !email) {
      return res
        .status(400)
        .json({ message: res.__('username_or_email_required') });
    }

    transaction = await sequelize.transaction({ autocommit: false });

    let user;
    if (username) {
      user = await User.findOne({ where: { username }, transaction });
    } else if (email) {
      user = await User.findOne({ where: { email }, transaction });
    }

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    if (user.otp !== code) {
      await transaction.rollback();
      return res.status(400).json({ message: res.__('invalid_otp') });
    }

    if (new Date() > user.otpExpiration) {
      await transaction.rollback();
      return res.status(400).json({ message: res.__('invalid_otp') });
    }

    await User.update(
      { otp: null, otpExpiration: null },
      { where: { email }, transaction },
    );

    await transaction.commit();
    return res.status(200).json({
      data: {},
      message: res.__('otp_verified'),
    });
  } catch (e) {
    console.log('Catch error for verifyOtp', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

const changePassword = async (req, res) => {
  let transaction;
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: res.__('invalid_email') });
    }

    transaction = await sequelize.transaction({ autocommit: false });
    const user = await User.findOne({ where: { email }, transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    if (user.otp || user.otpExpiration) {
      await transaction.rollback();
      return res.status(400).json({ message: res.__('otp_not_verified') });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update(
      { password: hashedPassword },
      { where: { email }, transaction },
    );

    await transaction.commit();
    return res.status(200).json({
      message: res.__('password_changed_success'),
    });
  } catch (e) {
    console.log('Catch error for changePassword', e);
    if (process.env.NODE_ENV !== 'development') {
      sendErrorEmail(e);
    }
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

module.exports = {
  signUp,
  signIn,
  tokenValidate,
  getAuthUser,
  forgotPassword,
  verifyOtp,
  changePassword,
};

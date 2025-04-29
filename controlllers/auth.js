const { sendErrorEmail } = require('../services/nodemiler');
const jwt = require('jsonwebtoken');
const { User, Role, Customer, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
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
      expiresIn: '1h',
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
      expiresIn: '1h',
    });
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

module.exports = {
  signUp,
  signIn,
};

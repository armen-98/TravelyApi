const jwt = require('jsonwebtoken');
const { User } = require('../models');

const noAuthToken = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];

    if (!token) return next();

    if (token.includes('Bearer')) {
      token = token.split(' ')[1];
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err || !decoded) return next();

      const user = await User.findByPk(decoded.id);
      if (!user) return next();

      req.user = user;
      return next();
    });
  } catch (error) {
    console.error('Middleware error:', error);
    return next();
  }
};

module.exports = {
  noAuthToken,
};

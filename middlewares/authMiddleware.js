const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: res.__('no_token') });
  }
  if (token.includes('Bearer')) {
    token = token.split(' ')[1];
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: res.__('failed_token') });
    }
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: res.__('access_denied') });
    }

    if (user.deactivatedAt) {
      return res.status(403).json({ message: res.__('account_deactivated') });
    }

    req.user = user;
    next();
  });
};

module.exports = {
  verifyToken,
};

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Access denied.' });
    }
    req.user = user;
    next();
  });
};

const checkUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isDeactivated) {
      return res.status(403).json({ message: 'User is deactivated' });
    }

    next();
  } catch (e) {
    console.log('Catch error for checkUserStatus', e);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  verifyToken,
  checkUserStatus,
};

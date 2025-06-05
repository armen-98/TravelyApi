const { roles } = require('../constants');

function allowAdminRoles(allowedRoles = []) {
  return (req, res, next) => {
    const userRole = req.user?.role?.name;

    if (userRole !== roles.SUPER_ADMIN) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    next();
  };
}

module.exports = allowAdminRoles;

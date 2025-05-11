const { Role } = require('../models');

// Check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Get user role
    const role = await Role.findByPk(req.user.roleId);

    if (!role || role.name !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
      });
    }

    next();
  } catch (error) {
    console.error('Role middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Check if user has specific permission
const hasPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // Get user role
      const role = await Role.findByPk(req.user.roleId);

      if (!role) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Invalid role.',
        });
      }

      // Check permission
      const permissions = role.permissions || {};
      const resourcePermissions = permissions[resource] || {};

      if (!resourcePermissions[action]) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have permission to ${action} ${resource}.`,
        });
      }

      // Check if permission is scoped to own resources
      if (resourcePermissions.scope === 'own') {
        req.permissionScope = 'own';
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

module.exports = {
  isAdmin,
  hasPermission,
};

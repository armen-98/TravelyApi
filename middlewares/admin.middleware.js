// Admin middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // verifyToken middleware should be called before this middleware
  // so req.user should be available
  if (!req.user) {
    return res.status(401).json({ message: res.__('authentication_required') });
  }

  if (req.user.role.name !== 'admin') {
    return res
      .status(403)
      .json({ message: res.__('access_denied_admin_privileges_required') });
  }

  next();
};

module.exports = {
  isAdmin,
};

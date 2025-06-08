const roles = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  BUSINESS: 'business',
  USER: 'user',
};

const PERMISSION_ALL = [roles.SUPER_ADMIN, roles.ADMIN, roles.MODERATOR];

module.exports = {
  roles,
  PERMISSION_ALL,
};

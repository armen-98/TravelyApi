const { Role, User } = require('../models');
// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'name', 'description', 'permissions'],
    });

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles',
      error: error.message,
    });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      attributes: ['id', 'name', 'description', 'permissions'],
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role',
      error: error.message,
    });
  }
};

// Create role
const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ where: { name } });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists',
      });
    }

    // Create role
    const role = await Role.create({
      name,
      description,
      permissions,
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      },
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create role',
      error: error.message,
    });
  }
};

// Update role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ where: { name } });

      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists',
        });
      }
    }

    // Update role
    await role.update({
      name: name || role.name,
      description: description || role.description,
      permissions: permissions || role.permissions,
    });

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      },
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: error.message,
    });
  }
};

// Delete role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    // Check if role is being used by any user
    const userCount = await User.count({ where: { roleId: id } });

    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete role as it is assigned to users',
      });
    }

    // Delete role
    await role.destroy();

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete role',
      error: error.message,
    });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};

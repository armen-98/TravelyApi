const { Facility, Product } = require('../models');
const { Op } = require('sequelize');

// Get all facilities
const getFacilities = async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;

    const whereConditions = {};
    if (search) {
      whereConditions.name = { [Op.like]: `%${search}%` };
    }

    const facilities = await Facility.findAll({
      where: whereConditions,
      limit: Number.parseInt(limit),
      order: [['count', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: facilities,
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch facilities',
      error: error.message,
    });
  }
};

// Get facility by ID
const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'products',
          through: { attributes: ['value'] },
        },
      ],
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }

    res.status(200).json({
      success: true,
      data: facility,
    });
  } catch (error) {
    console.error('Error fetching facility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch facility',
      error: error.message,
    });
  }
};

// Create facility
const createFacility = async (req, res) => {
  try {
    const { name, icon, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Facility name is required',
      });
    }

    // Check if facility with this name already exists
    const existingFacility = await Facility.findOne({ where: { name } });
    if (existingFacility) {
      return res.status(400).json({
        success: false,
        message: 'Facility with this name already exists',
      });
    }

    const facility = await Facility.create({
      name,
      icon,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: facility,
    });
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create facility',
      error: error.message,
    });
  }
};

// Update facility
const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description } = req.body;

    const facility = await Facility.findByPk(id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }

    // If name is changing, check for duplicates
    if (name && name !== facility.name) {
      const existingFacility = await Facility.findOne({
        where: { name, id: { [Op.ne]: id } },
      });
      if (existingFacility) {
        return res.status(400).json({
          success: false,
          message: 'Facility with this name already exists',
        });
      }
      facility.name = name;
    }

    if (icon !== undefined) {
      facility.icon = icon;
    }

    if (description !== undefined) {
      facility.description = description;
    }

    await facility.save();

    res.status(200).json({
      success: true,
      message: 'Facility updated successfully',
      data: facility,
    });
  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update facility',
      error: error.message,
    });
  }
};

// Delete facility
const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findByPk(id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }

    await facility.destroy();

    res.status(200).json({
      success: true,
      message: 'Facility deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete facility',
      error: error.message,
    });
  }
};

module.exports = {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};

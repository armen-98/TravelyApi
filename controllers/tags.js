const { Tag, Product } = require('../models');
const { Op } = require('sequelize');
const slugify = require('slugify');

// Get all tags
const getTags = async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;

    const whereConditions = {};
    if (search) {
      whereConditions.name = { [Op.like]: `%${search}%` };
    }

    const tags = await Tag.findAll({
      where: whereConditions,
      limit: Number.parseInt(limit),
      order: [['count', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags',
      error: error.message,
    });
  }
};

// Get tag by ID
const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'products',
          through: { attributes: [] },
        },
      ],
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found',
      });
    }

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tag',
      error: error.message,
    });
  }
};

// Create tag
const createTag = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tag name is required',
      });
    }

    const slug = slugify(name, { lower: true });

    // Check if tag with this slug already exists
    const existingTag = await Tag.findOne({ where: { slug } });
    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: 'Tag with this name already exists',
      });
    }

    const tag = await Tag.create({
      name,
      slug,
      color,
    });

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: tag,
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tag',
      error: error.message,
    });
  }
};

// Update tag
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found',
      });
    }

    // If name is changing, update slug and check for duplicates
    if (name && name !== tag.name) {
      const slug = slugify(name, { lower: true });
      const existingTag = await Tag.findOne({
        where: { slug, id: { [Op.ne]: id } },
      });
      if (existingTag) {
        return res.status(400).json({
          success: false,
          message: 'Tag with this name already exists',
        });
      }
      tag.slug = slug;
      tag.name = name;
    }

    if (color !== undefined) {
      tag.color = color;
    }

    await tag.save();

    res.status(200).json({
      success: true,
      message: 'Tag updated successfully',
      data: tag,
    });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tag',
      error: error.message,
    });
  }
};

// Delete tag
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found',
      });
    }

    await tag.destroy();

    res.status(200).json({
      success: true,
      message: 'Tag deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tag',
      error: error.message,
    });
  }
};

module.exports = {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};

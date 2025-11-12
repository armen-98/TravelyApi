const { Location } = require('../models');

// Get locations: supports flat fetching by type and parent_id
// type: 'country' | 'state' | 'city'
// - country: list all countries
// - state: requires parent_id (country id) → list states for that country
// - city: requires parent_id (state id) → list cities for that state
const getLocations = async (req, res) => {
  try {
    const { parent_id, type = 'country' } = req.query;

    // Validate type
    const allowed = ['country', 'state', 'city'];
    const resolvedType = allowed.includes(type) ? type : 'country';

    // For state and city, parent_id is required
    if ((resolvedType === 'state' || resolvedType === 'city') && !parent_id) {
      return res.status(400).json({
        success: false,
        message: `parent_id is required when type is '${resolvedType}'`,
      });
    }

    const where = { type: resolvedType };
    if (parent_id) where.parentId = parent_id;

    const rows = await Location.findAll({ where });

    const data = rows.map((loc) => ({
      term_id: loc.id,
      name: loc.name,
      type: loc.type,
      parent_id: loc.parentId ?? null,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations',
      error: error.message,
    });
  }
};

module.exports = {
  getLocations,
};

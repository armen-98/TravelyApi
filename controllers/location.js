const { Location } = require('../models');

// Get locations
const getLocations = async (req, res) => {
  try {
    const { parent_id, type = 'country' } = req.query;
    const where = {
      type:
        type === 'location'
          ? 'state'
          : type === 'category'
            ? 'city'
            : 'category',
    };

    if (parent_id) {
      where.parentId = parent_id;
    }

    const countries = await Location.findAll({
      where,
      include: [
        {
          model: Location,
          as: 'children',
          where: { type: 'state' },
          required: false,
          include: [
            {
              model: Location,
              as: 'children',
              where: { type: 'city' },
              required: false,
            },
          ],
        },
      ],
    });

    // Format response
    const formattedLocations = countries.map((country) => ({
      term_id: country.id,
      name: country.name,
      type: country.type,
      children: country.children?.map((state) => ({
        term_id: state.id,
        name: state.name,
        type: state.type,
        children: state.children?.map((city) => ({
          term_id: city.id,
          name: city.name,
          type: city.type,
        })),
      })),
    }));

    res.status(200).json({
      success: true,
      data: formattedLocations,
    });
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

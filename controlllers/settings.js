const { Setting } = require('../models');
const getConfigs = async (req, res) => {
  try {
    const configs = await Setting.findOne();
    return res.status(200).json({
      data: configs,
      message: 'Success',
    });
  } catch (e) {
    console.log('Catch for getConfigs', e);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
module.exports = {
  getConfigs,
};

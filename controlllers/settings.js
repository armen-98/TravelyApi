const { Setting, Customer } = require('../models');
const getConfigs = async (req, res) => {
  try {
    const configs = await Setting.findOne({
      where: { deviceId: req.headers.deviceid },
    });
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
const changeLanguage = async (req, res) => {
  try {
    const { language, deviceId } = req.body;
    const { user } = req;
    let configs = await Setting.findOne({
      where: { deviceId: req.headers.deviceid },
    });
    if (configs) {
      configs.language = language;

      await configs.save();
    } else {
      configs = await Setting.create({
        language,
        deviceId,
      });
    }

    await Customer.update(
      {
        language,
      },
      { where: { userId: user.id } },
    );

    return res.status(200).json({
      data: configs,
      message: 'Success',
    });
  } catch (e) {
    console.log('Catch for changeLanguage', e);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
module.exports = {
  getConfigs,
  changeLanguage,
};

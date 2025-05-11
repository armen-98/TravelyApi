const { Setting } = require('../models');
const languageMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.deviceid) {
      const languageFromDb = 'en';
      if (languageFromDb) {
        req.setLocale(languageFromDb);
      }
      next();
    } else {
      const settings = await Setting.findOne({
        where: {
          deviceId: req.headers.deviceid,
        },
        attributes: ['language', 'deviceId'],
      });
      const languageFromDb = settings?.language || 'en';
      if (languageFromDb) {
        req.setLocale(languageFromDb);
      }
      next();
    }
  } catch (error) {
    console.error('Error fetching language from DB:', error);
    next(error);
  }
};
module.exports = languageMiddleware;

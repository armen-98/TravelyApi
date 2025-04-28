const languageMiddleware = async (req, res, next) => {
  try {
    const languageFromDb = 'hy';
    if (languageFromDb) {
      req.setLocale(languageFromDb);
    }
    next();
  } catch (error) {
    console.error('Error fetching language from DB:', error);
    next(error);
  }
};
module.exports = languageMiddleware;

const multer = require('multer');

const upload = multer().any();

const multerMiddleware = async (req, res, next) => {
  await upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log('multer error');
      return res.status(400).json({ message: res.__('internal_error') });
    } else if (err) {
      console.log({ err });
      return res.status(400).json({ message: res.__('internal_error') });
    }
    next();
  });
};

module.exports = multerMiddleware;

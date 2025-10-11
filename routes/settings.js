const express = require('express');
const router = express.Router();

const settingsController = require('../controllers/settings');
const { verifyToken } = require('../middlewares/authMiddleware');
const { noAuthToken } = require('../middlewares/noAuth');

router.get('/', noAuthToken, settingsController.getSettings);
router.post('/change-language', verifyToken, settingsController.changeLanguage);
router.post('/update-token', verifyToken, settingsController.updateDeviceToken);

module.exports = router;

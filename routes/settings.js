const express = require('express');
const router = express.Router();

const settingsController = require('../controlllers/settings');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', settingsController.getConfigs);
router.post('/change-language', verifyToken, settingsController.changeLanguage);

module.exports = router;

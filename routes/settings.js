const express = require('express');
const router = express.Router();

const settingsController = require('../controlllers/settings');

router.get('/', settingsController.getConfigs);

module.exports = router;

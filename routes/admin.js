const express = require('express');
const router = express.Router();

const adminController = require('../controlllers/admin');

router.post('/', adminController.createAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const authRouter = require('./auth');
const settingsRouter = require('./settings');

router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/settings', settingsRouter);

module.exports = router;

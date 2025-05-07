const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const authRouter = require('./auth');
const settingsRouter = require('./settings');
const customerRouter = require('./customer');

router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/settings', settingsRouter);
router.use('/customer', customerRouter);

module.exports = router;

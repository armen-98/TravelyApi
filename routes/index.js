const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const authRouter = require('./auth');

router.use('/admin', adminRouter);
router.use('/auth', authRouter);

module.exports = router;

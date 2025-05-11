const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const authRouter = require('./auth');
const settingsRouter = require('./settings');
const userRouter = require('./user');
const contactRouter = require('./contact');
const authorRouter = require('./author');
const blogRouter = require('./blog');
const bookingRouter = require('./booking');
const categoryRouter = require('./category');
const claimRouter = require('./claim');
const commentRouter = require('./comment');
const facilitiesRouter = require('./facilities');
const homeRoutes = require('./home');
const locationsRouter = require('./location');
const paymentRouter = require('./payment');
const productRouter = require('./product');
const roleRouter = require('./role');
const scheduleRouter = require('./schedule');
const tagsRouter = require('./tags');
const uploadRouter = require('./upload');
const wishlistRouter = require('./wishlist');

router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/settings', settingsRouter);
router.use('/user', userRouter);
router.use('/contact', contactRouter);
router.use('/author', authorRouter);
router.use('/blog', blogRouter);
router.use('/booking', bookingRouter);
router.use('/category', categoryRouter);
router.use('/claim', claimRouter);
router.use('/comment', commentRouter);
router.use('/facility', facilitiesRouter);
router.use('/home', homeRoutes);
router.use('/location', locationsRouter);
router.use('/payment', paymentRouter);
router.use('/product', productRouter);
router.use('/role', roleRouter);
router.use('/schedule', scheduleRouter);
router.use('/tags', tagsRouter);
router.use('/upload', uploadRouter);
router.use('/wishlist', wishlistRouter);

// Contact us

module.exports = router;

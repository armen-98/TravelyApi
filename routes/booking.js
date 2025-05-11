const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  getBookingForm,
  calculatePrice,
  createOrder,
  getBookingDetail,
  getBookingList,
  getBookingRequestList,
  cancelBooking,
  acceptBooking,
} = require('../controllers/booking.js');

const router = express.Router();

// Get booking form
router.get('/form', getBookingForm);

// Calculate booking price
router.post('/cart', calculatePrice);

// Create booking order
router.post('/order', verifyToken, createOrder);

// Get booking details
router.get('/view/:id', verifyToken, getBookingDetail);

// Get booking list
router.get('/list', verifyToken, getBookingList);

// Get booking request list (for product owners)
router.get('/request', verifyToken, getBookingRequestList);

// Cancel booking
router.post('/cancel_by_id/:id', verifyToken, cancelBooking);

// Accept booking
router.post('/accept_by_id/:id', verifyToken, acceptBooking);

module.exports = router;
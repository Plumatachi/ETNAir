const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middlewares/auth');
const { validateBooking, validateUpdateBooking } = require('../validators/bookingValidator');

router.get('/check-availability/:idhome', bookingController.checkAvailability.bind(bookingController));
router.get('/my-bookings', authenticate, bookingController.getMyBookings.bind(bookingController));
router.get('/home/:idhome', authenticate, bookingController.getHomeBookings.bind(bookingController));

router.post('/', authenticate, validateBooking, bookingController.createBooking.bind(bookingController));
router.get('/:idbooking', authenticate, bookingController.getBooking.bind(bookingController));
router.put('/:idbooking', authenticate, validateUpdateBooking, bookingController.updateBooking.bind(bookingController));
router.delete('/:idbooking', authenticate, bookingController.deleteBooking.bind(bookingController));

module.exports = router;
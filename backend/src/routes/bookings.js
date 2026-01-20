const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Booking CRUD operations
router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.get('/:id/history', bookingController.getBookingHistory);

// Booking lifecycle operations
router.patch('/:id/cancel', bookingController.cancelBooking);
router.patch('/:id/assign', bookingController.assignProvider);

// Provider workflow operations
router.patch('/:id/accept', bookingController.acceptBooking);
router.patch('/:id/reject', bookingController.rejectBooking);
router.patch('/:id/start', bookingController.startService);
router.patch('/:id/complete', bookingController.completeService);
router.patch('/:id/no-show', bookingController.markNoShow);

// Admin operations
router.patch('/:id/override', bookingController.overrideStatus);

module.exports = router;

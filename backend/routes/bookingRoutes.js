// routes/bookingRoutes.js
import express from 'express';
import {
  createBooking,
  getUserBookings,
  getProviderBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/provider', protect, getProviderBookings);
router.put('/:id', protect, updateBookingStatus);

export default router;
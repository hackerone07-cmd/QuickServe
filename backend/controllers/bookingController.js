// controllers/bookingController.js
import Booking from "../models/Booking.model.js";

export const createBooking = async (req, res) => {
  try {
    const { providerId, serviceId, date, time, notes } = req.body;
    const booking = new Booking({
      customerId: req.user._id,
      providerId,
      serviceId,
      date,
      time,
      notes,
    });
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('providerId', 'name')
      .populate('serviceId', 'title');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user._id })
      .populate('customerId', 'name')
      .populate('serviceId', 'title');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update booking' });
  }
};
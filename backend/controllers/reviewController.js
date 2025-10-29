// controllers/reviewController.js
import Review from "../models/Review.model.js";

export const createReview = async (req, res) => {
  try {
    const { providerId, serviceId, rating, comment } = req.body;

    const existing = await Review.findOne({
      customerId: req.user._id,
      serviceId,
    });

    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this service' });
    }

    const review = new Review({
      customerId: req.user._id,
      providerId,
      serviceId,
      rating,
      comment,
    });

    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

export const getReviewsForProvider = async (req, res) => {
  try {
    const reviews = await Review.find({ providerId: req.params.id })
      .populate('customerId', 'name')
      .populate('serviceId', 'title');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};
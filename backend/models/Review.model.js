  // models/Review.js
  import mongoose from 'mongoose';

  const reviewSchema = new mongoose.Schema({
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String },
    date: { type: Date, default: Date.now },
  }, { timestamps: true });

  const Review = mongoose.model('Review', reviewSchema);
  export default Review;
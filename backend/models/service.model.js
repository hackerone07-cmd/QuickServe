// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Plumber', 'Electrician', 'Carpenter', 'Cleaner', 'Other'],
  },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  availability: [{ type: String }], // type: ['Mon 10-12', 'Tue 2-4']
  location: { type: String, required: true },
  rating: { type: Number, default: 0 },
  images: [{ type: String }],
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);

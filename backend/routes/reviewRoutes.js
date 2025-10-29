// routes/reviewRoutes.js
import express from 'express';
import {
  createReview,
  getReviewsForProvider,
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/provider/:id', getReviewsForProvider);

export default router;
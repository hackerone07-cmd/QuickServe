// routes/serviceRoutes.js
import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.route('/')
  .get(getAllServices)
  .post(protect, upload.array('images', 5), createService); // up to 5 images

router.route('/:id')
  .get(getServiceById)
  .put(protect, updateService)
  .delete(protect, deleteService);

export default router;
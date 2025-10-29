// routes/uploadRoutes.js
import express from 'express';
import upload from '../config/multer.js';
import { protect } from '../middlewares/authMiddleware.js';



const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

export default router;
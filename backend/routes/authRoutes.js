// routes/authRoutes.js
import express from "express"
import { Router } from "express";
const router = Router();
import { register,login } from "../controllers/authController.js";

router.post('/register', register);
router.post('/login', login);

export default router;
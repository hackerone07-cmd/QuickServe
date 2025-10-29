import dotenv from "dotenv"
dotenv.config();
import express from "express"
import mongoose from "mongoose"
import cors from "cors"

import authRoutes from "./routes/authRoutes.js"
// import userRoutes from "./routes/userRoutes.js"
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';





const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',authRoutes);
// app.use('/api/users', userRoutes);


app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
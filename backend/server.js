import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importing routes
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

import dataRoutes from './routes/dataRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: [
        'https://a-c-e-8g4t.vercel.app',  // Production frontend
        'http://localhost:5173',             // Local development
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/data', dataRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('A.C.E Backend API is running!');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

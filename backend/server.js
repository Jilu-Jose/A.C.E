import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importing routes
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import connectDB from './utils/db.js';

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

// Global database connection middleware for serverless robustness
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database middleware error:', error.message);
        res.status(500).json({ message: 'Internal Server Error: Database connection failed.' });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/data', dataRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('A.C.E Backend API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

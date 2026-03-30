import mongoose from 'mongoose';

const connectDB = async () => {
    // If we're already connected, return the current connection
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is missing from environment variables');
        throw new Error('Database configuration missing');
    }

    // Set command buffering to false so we fail fast if a query is made before connecting
    mongoose.set('bufferCommands', false);

    console.log('Attempting to connect to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    }
};

export default connectDB;

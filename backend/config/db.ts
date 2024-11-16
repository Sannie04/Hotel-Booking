import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const connectDB = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', true); // Suppress strictQuery warnings

        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        console.log('Connecting to MongoDB with URI:', mongoUri);  // Debug line

        const connect = await mongoose.connect(mongoUri);
        console.log(`Database connected: ${connect.connection.host}`);
    } catch (error: any) {
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1); // Exit the application if error occurs
    }
};

export default connectDB;

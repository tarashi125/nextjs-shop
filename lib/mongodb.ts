import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
    if (isConnected) return;

    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('❌ MONGODB_URI is not defined in environment variables.');
    }

    try {
        await mongoose.connect(uri, {dbName: 'thanhlich'});

        isConnected = true;
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};
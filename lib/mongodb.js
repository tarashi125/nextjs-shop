import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'thanhlich',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = true;
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};
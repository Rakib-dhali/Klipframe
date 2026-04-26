import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB error:", err);
        });

        await mongoose.connect(process.env.MONGO_URI as string);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
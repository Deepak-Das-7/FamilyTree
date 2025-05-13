import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  const MONGO = process.env.MONGO_URI;

  if (!MONGO) {
    console.log("❌ MONGO_URI is not defined");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO, {
      autoIndex: false,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

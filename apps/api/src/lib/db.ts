import mongoose from "mongoose";
import { config } from "../config";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  try {
    await mongoose.connect(config.mongoUri);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    // process.exit(1); // avoid exiting the process in serverless
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err);
  });
}

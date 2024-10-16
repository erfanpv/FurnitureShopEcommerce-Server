import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGODB_URL;

const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(mongoUrl, {
      dbName: "furnitureshop", // Explicitly set the database name here
    });
    console.log(`MongoDB running on host ${connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDb;

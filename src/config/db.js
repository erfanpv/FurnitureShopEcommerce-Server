import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoUrl = process.env.MONGODB_URL;

const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(mongoUrl);
    console.log(`mongoDB running  on port ${connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;

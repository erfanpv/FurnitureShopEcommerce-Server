import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  addressData: {
    pincode: { type: String, required: true, min: 100000, max: 999999 },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: "India", trim: true },
  },
});


const addressDb = mongoose.model("address", addressSchema);
export default addressDb;

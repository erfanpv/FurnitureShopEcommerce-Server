import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  addressData: {
    pinCode: { type: Number, required: true, min: 100000, max: 999999 },
    locality: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    addressLine: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: "India", trim: true },
  },
});

// addressSchema.index({ userId: 1 });

const addressDb = mongoose.model("Address", addressSchema);
export default addressDb;

import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  allAddresses: [
    {
      pincode: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6,
        trim: true,
      },
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        default: "India",
        trim: true,
      },
      phone: {
        type: Number,
        required: true,
      },
    },
  ],
});

const addressDb = mongoose.model("Address", addressSchema);
export default addressDb;

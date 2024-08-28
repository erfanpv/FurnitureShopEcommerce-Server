import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  status: {
    type: String,
    enum: [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded",
    ],
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["razorpay"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
  shippedAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  returnedAt: {
    type: Date,
  },
  refundedAt: {
    type: Date,
  },
  address: {
    type: Object,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },

  reason: {
    type: String,
  },
});

const orderDb = mongoose.model("Orders", orderSchema);
export default orderDb;

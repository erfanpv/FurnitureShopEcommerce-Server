import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderDetails: [{
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
      total: {
        type: Number,
        min: 0,
      },
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
        enum: ["razorpay","stripe","phonpe"],
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
        required:true
      },
      isCancelled: {
        type: Boolean,
        default: false,
      },
    
      reason: {
        type: String,
      },
    }]
});

const orderDb = mongoose.model("orders", orderSchema);
export default orderDb;

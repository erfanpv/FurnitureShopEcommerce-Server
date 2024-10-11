  import mongoose from "mongoose";

  const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderDetails: [
      {
        orderId: {
          type: String,
        },
        paymentId: {
          type: String,
        },
        products: [
          {
            productId: {
              productName: { type: String },
              description: { type: String },
              price: { type: Number },
              image: { type: String },
              category: { type: String },
            },
            quantity: { type: Number },
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
          enum: ["razorpay", "stripe", "phonpe"],
          default: "stripe",
        },
        orderUsermail: {
          type: String,
        },
        orderedUserName: {
          type: String,
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
        cancelledAt: {
          type: Date,
        },
        refundedAt: {
          type: Date,
        },
        shippingAddress: {
          type: Object,
        },
        isCancelled: {
          type: Boolean,
          default: false,
        },
        isReturned: {
          type: Boolean,
          default: false,
        },
        reason: {
          type: String,
        },
      },
    ],
  });

  const orderDb = mongoose.model("orders", orderSchema);
  export default orderDb;

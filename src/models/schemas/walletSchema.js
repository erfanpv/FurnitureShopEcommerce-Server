import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  balance: {
    type: Number,
    default: 0.0,
  },
  transactions: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
      },
      walletUpdate: {
        type: String,
        enum: ["credited", "debited","purchase"],
        default: "credited",
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const walletDb = mongoose.model("wallets", walletSchema);
export default walletDb
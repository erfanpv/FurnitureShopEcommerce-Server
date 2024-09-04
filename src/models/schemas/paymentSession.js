import mongoose from 'mongoose';

const PaymentSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  paymentData: [
    {
      sessionId: {
        type: String,
        required: true
      },
      paymentProductData: {
        type: mongoose.Schema.Types.Mixed, 
        required: true
      },
      totalAmount: {
        type: Number,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PaymentSession = mongoose.model('PaymentSession', PaymentSessionSchema);

export default PaymentSession;

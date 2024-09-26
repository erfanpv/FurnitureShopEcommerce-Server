import mongoose from 'mongoose';


const paymentSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  paymentData: [
    {
      sessionId: { type: String, required: true, unique: true },
      paymentProductData: { type: Map, of: String },
      totalAmount: { type: Number },
    },
  ],
});




// Ensure that there is no unique constraint on sessionId

const paymentSession = mongoose.model('paymentSession', paymentSessionSchema);

export default paymentSession;

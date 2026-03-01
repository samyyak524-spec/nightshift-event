import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pass: { type: mongoose.Schema.Types.ObjectId, ref: 'Pass', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: { type: String, enum: ['created', 'captured', 'failed'], default: 'created' }
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);

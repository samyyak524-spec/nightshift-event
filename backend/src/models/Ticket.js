import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, required: true },
    qrCodeDataUrl: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pass: { type: mongoose.Schema.Types.ObjectId, ref: 'Pass', required: true },
    passName: { type: String, required: true },
    phaseName: { type: String, required: true },
    pricePaid: { type: Number, required: true },
    paymentId: { type: String, required: true },
    entryStatus: { type: String, enum: ['unused', 'used'], default: 'unused' },
    checkedInAt: Date
  },
  { timestamps: true }
);

export const Ticket = mongoose.model('Ticket', ticketSchema);

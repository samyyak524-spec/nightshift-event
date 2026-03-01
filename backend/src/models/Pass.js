import mongoose from 'mongoose';

const passSchema = new mongoose.Schema(
  {
    passName: { type: String, required: true },
    phaseName: { type: String, required: true },
    price: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    remainingQuantity: { type: Number, required: true },
    saleStartDate: { type: Date, required: true },
    saleEndDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive', 'sold_out'], default: 'active' },
    sortOrder: { type: Number, default: 0 },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export const Pass = mongoose.model('Pass', passSchema);

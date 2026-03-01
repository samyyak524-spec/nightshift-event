import mongoose from 'mongoose';
import { ROLES } from '../config/roles.js';

const otpSchema = new mongoose.Schema(
  {
    code: String,
    expiresAt: Date
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },
    otp: otpSchema,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

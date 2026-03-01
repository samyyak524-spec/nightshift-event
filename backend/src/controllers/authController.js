import { User } from '../models/User.js';
import { generateOtp, otpExpiry } from '../services/otpService.js';
import { signToken } from '../utils/jwt.js';

export const requestOtp = async (req, res) => {
  const { name, email, phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone is required' });

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ name: name || 'Guest User', email, phone });
  }

  const code = generateOtp();
  user.otp = { code, expiresAt: otpExpiry() };
  if (email) user.email = email;
  if (name) user.name = name;
  await user.save();

  console.log(`Dummy OTP for ${phone}: ${code}`);
  res.json({ message: 'OTP sent (console mode)', otpForDev: code });
};

export const verifyOtp = async (req, res) => {
  const { phone, code } = req.body;
  const user = await User.findOne({ phone });
  if (!user?.otp?.code) return res.status(400).json({ message: 'OTP not requested' });

  const valid = user.otp.code === code && new Date(user.otp.expiresAt).getTime() > Date.now();
  if (!valid) return res.status(400).json({ message: 'Invalid or expired OTP' });

  user.otp = undefined;
  await user.save();

  const token = signToken(user);
  res.json({ token, user });
};

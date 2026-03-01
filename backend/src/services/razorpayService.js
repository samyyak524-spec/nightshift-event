import crypto from 'crypto';
import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret'
});

export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const generated = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret')
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return generated === signature;
};

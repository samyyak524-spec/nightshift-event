export const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export const otpExpiry = () => new Date(Date.now() + 5 * 60 * 1000);

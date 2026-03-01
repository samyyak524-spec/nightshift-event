import { useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', code: '' });
  const [devOtp, setDevOtp] = useState('');
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const requestOtp = async () => {
    const res = await api.post('/auth/request-otp', form);
    setDevOtp(res.data.otpForDev);
  };

  const verifyOtp = async () => {
    const res = await api.post('/auth/verify-otp', { phone: form.phone, code: form.code });
    setAuth({ token: res.data.token, user: res.data.user });
    navigate('/');
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10 text-slate-100">
      <h1 className="text-2xl font-bold">Login with OTP</h1>
      <div className="mt-4 space-y-3">
        {['name', 'email', 'phone', 'code'].map((field) => (
          <input
            key={field}
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder={field.toUpperCase()}
            value={form[field]}
            onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
          />
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={requestOtp} className="rounded bg-amber-300 px-4 py-2 text-black">Request OTP</button>
        <button onClick={verifyOtp} className="rounded bg-emerald-500 px-4 py-2 text-black">Verify & Login</button>
      </div>
      {devOtp && <p className="mt-3 text-sm text-amber-300">Dev OTP: {devOtp}</p>}
    </main>
  );
}

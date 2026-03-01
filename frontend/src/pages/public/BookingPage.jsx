import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function BookingPage() {
  const { passId } = useParams();
  const { auth } = useAuth();
  const [pass, setPass] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/passes/public').then((res) => setPass(res.data.find((item) => item._id === passId)));
  }, [passId]);

  const simulatePayment = async () => {
    if (!auth) return setMsg('Please login first');
    const orderRes = await api.post('/tickets/order', { passId });
    const fakePaymentId = `pay_${Date.now()}`;
    const crypto = await import('crypto-js');
    const secret = import.meta.env.VITE_RAZORPAY_SECRET || 'secret';
    const signature = crypto.HmacSHA256(`${orderRes.data.order.id}|${fakePaymentId}`, secret).toString();

    await api.post('/tickets/verify', {
      passId,
      razorpayOrderId: orderRes.data.order.id,
      razorpayPaymentId: fakePaymentId,
      razorpaySignature: signature
    });

    setMsg('Ticket booked successfully. Check My Tickets.');
  };

  if (!pass) return <p className="p-6 text-slate-100">Loading pass...</p>;

  return (
    <main className="mx-auto max-w-xl p-6 text-slate-100">
      <h1 className="text-3xl font-bold">{pass.passName}</h1>
      <p>{pass.phaseName}</p>
      <p className="mt-3 text-2xl">₹{pass.price}</p>
      <button className="mt-4 rounded bg-emerald-500 px-4 py-2 text-black" onClick={simulatePayment}>Pay with Razorpay (Test)</button>
      {msg && <p className="mt-4 text-amber-300">{msg}</p>}
    </main>
  );
}

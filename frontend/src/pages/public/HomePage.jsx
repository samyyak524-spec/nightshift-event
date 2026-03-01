import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api/client';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [passes, setPasses] = useState([]);

  useEffect(() => {
    api.get('/passes/public').then((res) => setPasses(res.data));
  }, []);

  const cheapest = useMemo(() => passes.reduce((a, b) => (!a || b.price < a.price ? b : a), null), [passes]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-slate-100">
      <h1 className="text-4xl font-bold text-amber-300">Shama & Soul</h1>
      <p className="mt-3 text-slate-300">Flea Market + Sufi Night • April End</p>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {passes.map((pass) => (
          <article key={pass._id} className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{pass.passName}</h2>
              {cheapest?._id === pass._id && <span className="rounded bg-amber-300 px-2 py-1 text-xs text-black">Cheapest</span>}
            </div>
            <p className="text-slate-400">{pass.phaseName}</p>
            <p className="mt-2 text-2xl font-bold">₹{pass.price}</p>
            <p className="text-sm text-slate-400">Remaining: {pass.remainingQuantity}</p>
            <Link className="mt-4 inline-block rounded bg-emerald-500 px-4 py-2 text-black" to={`/book/${pass._id}`}>
              Book Now
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

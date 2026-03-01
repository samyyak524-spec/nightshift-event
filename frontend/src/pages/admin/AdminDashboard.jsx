import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [event, setEvent] = useState(null);
  const [passes, setPasses] = useState([]);

  const load = async () => {
    const [dash, eventRes, passRes] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/event-content'),
      api.get('/passes')
    ]);
    setDashboard(dash.data);
    setEvent(eventRes.data);
    setPasses(passRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const saveEvent = async () => {
    await api.patch('/admin/event-content', event);
    load();
  };

  if (!dashboard || !event) return <p className="p-6 text-slate-100">Loading dashboard...</p>;

  return (
    <main className="mx-auto max-w-6xl p-6 text-slate-100">
      <h1 className="text-3xl font-bold text-amber-300">Organizer Dashboard</h1>
      <section className="mt-4 grid gap-4 md:grid-cols-4">
        {[
          ['Users', dashboard.totalUsers],
          ['Tickets', dashboard.totalTickets],
          ['Revenue', `₹${dashboard.totalRevenue}`],
          ['Volunteers', dashboard.totalVolunteers]
        ].map(([label, value]) => (
          <div key={label} className="rounded border border-slate-700 bg-slate-900 p-4">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">Edit Event Content</h2>
        {['websiteName', 'eventName', 'eventType', 'expectedTime', 'superAdminName', 'description', 'heroImage'].map((field) => (
          <input
            key={field}
            className="mt-2 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            value={event[field] || ''}
            onChange={(e) => setEvent((prev) => ({ ...prev, [field]: e.target.value }))}
            placeholder={field}
          />
        ))}
        <button onClick={saveEvent} className="mt-3 rounded bg-amber-300 px-4 py-2 text-black">Save Event</button>
      </section>

      <section className="mt-8 rounded border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">Passes</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {passes.map((pass) => (
            <PassCard key={pass._id} pass={pass} onUpdated={load} />
          ))}
        </div>
      </section>
    </main>
  );
}

function PassCard({ pass, onUpdated }) {
  const [draft, setDraft] = useState(pass);

  const save = async () => {
    await api.patch(`/passes/${pass._id}`, {
      ...draft,
      totalQuantity: Number(draft.totalQuantity),
      remainingQuantity: Number(draft.remainingQuantity),
      price: Number(draft.price)
    });
    onUpdated();
  };

  return (
    <article className="rounded border border-slate-700 p-3">
      {['passName', 'phaseName', 'price', 'totalQuantity', 'remainingQuantity', 'status'].map((field) => (
        <input
          key={field}
          className="mt-2 w-full rounded bg-slate-950 px-2 py-1"
          value={draft[field]}
          onChange={(e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }))}
        />
      ))}
      <button onClick={save} className="mt-3 rounded bg-emerald-500 px-3 py-1 text-black">Update Pass</button>
    </article>
  );
}

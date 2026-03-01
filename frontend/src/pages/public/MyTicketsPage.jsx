import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function MyTicketsPage() {
  const { auth } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (auth) api.get('/tickets/mine').then((res) => setTickets(res.data));
  }, [auth]);

  if (!auth) return <p className="p-6 text-slate-100">Login to view tickets.</p>;

  return (
    <main className="mx-auto max-w-4xl p-6 text-slate-100">
      <h1 className="text-3xl font-bold">My Tickets</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="rounded border border-slate-700 bg-slate-900 p-4">
            <p className="font-semibold">{ticket.ticketId}</p>
            <p>{ticket.passName} • {ticket.phaseName}</p>
            <p>Status: {ticket.entryStatus}</p>
            <img src={ticket.qrCodeDataUrl} alt={ticket.ticketId} className="mt-3 w-40 rounded bg-white p-2" />
          </div>
        ))}
      </div>
    </main>
  );
}

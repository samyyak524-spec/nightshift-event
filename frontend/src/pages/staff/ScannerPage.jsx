import { useState } from 'react';
import { api } from '../../api/client';

export default function ScannerPage() {
  const [ticketId, setTicketId] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const scan = async () => {
    setError('');
    try {
      const res = await api.post('/tickets/scan', { ticketId });
      setResponse(res.data);
    } catch (e) {
      setResponse(null);
      setError(e.response?.data?.message || 'Scan failed');
    }
  };

  return (
    <main className="mx-auto max-w-xl p-6 text-slate-100">
      <h1 className="text-3xl font-bold">QR Entry Scanner</h1>
      <p className="mt-2 text-slate-300">Paste Ticket ID from decoded QR payload.</p>
      <input className="mt-3 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2" value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
      <button onClick={scan} className="mt-3 rounded bg-amber-300 px-4 py-2 text-black">Verify Entry</button>
      {response && <pre className="mt-4 rounded bg-slate-900 p-3 text-xs">{JSON.stringify(response, null, 2)}</pre>}
      {error && <p className="mt-3 text-rose-400">{error}</p>}
    </main>
  );
}

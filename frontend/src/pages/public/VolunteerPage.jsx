import { useState } from 'react';
import { api } from '../../api/client';

export default function VolunteerPage() {
  const [form, setForm] = useState({
    name: '', age: '', phone: '', email: '', instagramLink: '', experience: '', pastEvents: '', interestedFields: ''
  });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/volunteers', {
      ...form,
      age: Number(form.age),
      interestedFields: form.interestedFields.split(',').map((i) => i.trim()).filter(Boolean)
    });
    setMsg('Applied successfully.');
  };

  return (
    <main className="mx-auto max-w-2xl p-6 text-slate-100">
      <h1 className="text-3xl font-bold">Volunteer Registration</h1>
      <form className="mt-4 grid gap-3" onSubmit={submit}>
        {Object.keys(form).map((field) => (
          <input
            key={field}
            className="rounded border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder={field}
            value={form[field]}
            onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
          />
        ))}
        <button className="rounded bg-emerald-500 px-4 py-2 text-black" type="submit">Apply</button>
      </form>
      {msg && <p className="mt-3 text-emerald-300">{msg}</p>}
    </main>
  );
}

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { auth, setAuth } = useAuth();
  return (
    <header className="border-b border-slate-800 bg-slate-900/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm">
        <Link className="font-semibold text-amber-300" to="/">The Nightshift Event</Link>
        <div className="flex items-center gap-4 text-slate-200">
          <Link to="/volunteer">Volunteer</Link>
          <Link to="/my-tickets">My Tickets</Link>
          {auth?.user?.role !== 'user' && <Link to="/admin">Dashboard</Link>}
          {auth ? (
            <button onClick={() => setAuth(null)} className="rounded bg-rose-500 px-3 py-1">Logout</button>
          ) : (
            <Link className="rounded bg-emerald-500 px-3 py-1" to="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

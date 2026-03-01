import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import BookingPage from './pages/public/BookingPage';
import VolunteerPage from './pages/public/VolunteerPage';
import MyTicketsPage from './pages/public/MyTicketsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ScannerPage from './pages/staff/ScannerPage';
import { useAuth } from './context/AuthContext';

function Protected({ children, roles }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(auth.user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book/:passId" element={<BookingPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/admin" element={<Protected roles={['super_admin', 'admin']}><AdminDashboard /></Protected>} />
        <Route path="/scanner" element={<Protected roles={['super_admin', 'admin', 'staff']}><ScannerPage /></Protected>} />
      </Routes>
    </div>
  );
}

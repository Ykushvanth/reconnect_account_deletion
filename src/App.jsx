import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DeletePage from './pages/DeletePage';
import SuccessPage from './pages/SuccessPage';
import PrivacyPage from './pages/PrivacyPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"          element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/delete"    element={<DeletePage />} />
          <Route path="/success"   element={<SuccessPage />} />
          <Route path="/privacy"   element={<PrivacyPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

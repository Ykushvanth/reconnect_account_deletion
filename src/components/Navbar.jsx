import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOutIcon, ShieldIcon } from './Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
          <img
            src="/reconnect_logo.png"
            alt="ReConnect logo"
            className="brand-logo-img"
          />
          <span className="brand-name">
            Re<span>Connect</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge-pill">
            <ShieldIcon size={11} />
            Account Portal
          </span>

          {user && (
            <button
              id="navbar-logout-btn"
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
            >
              <LogOutIcon size={14} />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

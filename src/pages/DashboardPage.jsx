import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../lib/auth';
import {
  UserIcon, PhoneIcon, MapPinIcon, CakeIcon, BadgeIcon,
  TrashIcon, LogOutIcon, AlertIcon, CalendarIcon,
} from '../components/Icons';

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0,2).map(n => n[0].toUpperCase()).join('');
}

const INFO_ITEMS = (p) => [
  { icon: <UserIcon size={18} />,  color: '#667EEA', bg: 'rgba(102,126,234,0.1)', label: 'Full Name',     value: p.name },
  { icon: <PhoneIcon size={18} />, color: '#48BB78', bg: 'rgba(72,187,120,0.1)',  label: 'Phone Number',  value: p.phone },
  { icon: <CakeIcon size={18} />,  color: '#9F7AEA', bg: 'rgba(159,122,234,0.1)', label: 'Date of Birth',
    value: p.dob ? new Date(p.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Not provided' },
  { icon: <UserIcon size={18} />,  color: '#ED8936', bg: 'rgba(237,137,54,0.1)',  label: 'Gender',        value: p.gender },
  { icon: <BadgeIcon size={18} />, color: '#4299E1', bg: 'rgba(66,153,225,0.1)',  label: 'Aadhar Number',
    value: p.aadhar === 'Not linked' ? 'Not linked' : `XXXX XXXX ${p.aadhar.slice(-4)}` },
  { icon: <MapPinIcon size={18} />,color: '#F56565', bg: 'rgba(245,101,101,0.1)', label: 'Address',       value: p.address },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/', { replace: true }); return; }
    fetchUserProfile(user.id)
      .then(setProfile)
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }, [user, navigate]);

  if (!user) return null;
  const p = profile || user;

  const sinceDate = p.createdAt
    ? new Date(p.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null;

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  return (
    <>
      <div className="page-bg" />
      <div className="page-wrapper top">
        {/* Profile card — gradient hero + white info section */}
        <div className="card card-wide" style={{ padding: 0, overflow: 'hidden', maxWidth: 860 }}>

          {/* Hero — matches Flutter profile.dart _ProfileHeader gradient */}
          <div className="profile-hero">
            <div className="hero-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0, flex: 1 }}>
                <div className="avatar">{getInitials(p.name) || '?'}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="profile-name">{p.name}</div>
                  <div className="profile-email">{p.email}</div>
                  {sinceDate && (
                    <div className="profile-since">
                      <CalendarIcon size={12} />
                      Member since {sinceDate}
                    </div>
                  )}
                </div>
              </div>
              <button id="dashboard-logout-btn" className="hero-logout-btn" onClick={handleLogout}>
                <LogOutIcon size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Info section — white panel */}
          <div className="info-section">
            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
              <span className="section-title">Account Details</span>
              {refreshing && (
                <span className="text-xs text-muted flex items-center gap-8">
                  <span className="spin dark" style={{ width: 13, height: 13, borderWidth: 2 }} />
                  Refreshing…
                </span>
              )}
            </div>

            <div className="info-grid">
              {INFO_ITEMS(p).map(item => (
                <div key={item.label} className="info-item">
                  <div className="info-icon" style={{ background: item.bg }}>
                    <span style={{ color: item.color }}>{item.icon}</span>
                  </div>
                  <div>
                    <div className="info-label">{item.label}</div>
                    <div className="info-value" title={item.value}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Danger zone */}
            <div className="danger-zone">
              <div className="danger-title">
                <AlertIcon size={17} />
                Danger Zone
              </div>
              <p className="danger-desc">
                Permanently delete your ReConnect account and all associated data. This action
                <strong> cannot be undone</strong>. You will lose access to your reports, case
                history, and all personal information stored on our servers.
              </p>
              <button
                id="delete-account-btn"
                className="btn btn-danger"
                onClick={() => navigate('/delete')}
              >
                <TrashIcon size={15} />
                Delete My Account
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted text-center mt-16" style={{ maxWidth: 500, lineHeight: 1.6 }}>
          Your data is encrypted and stored securely. Deleting your account removes all personal
          data within <strong>30 days</strong>.
        </p>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteAccount } from '../lib/auth';
import { TrashIcon, AlertIcon, InfoIcon, CheckIcon } from '../components/Icons';

const DATA_ROWS = [
  { type: 'Profile information (name, email, phone, gender, date of birth)', action: 'del', period: 'Within 30 days' },
  { type: 'Address and Aadhar number',            action: 'del', period: 'Within 30 days' },
  { type: 'Uploaded photos and sightings',         action: 'del', period: 'Within 30 days' },
  { type: 'Login credentials and password hash',   action: 'del', period: 'Immediately' },
  { type: 'Case reports and history',              action: 'del', period: 'Within 30 days' },
  { type: 'Anonymised statistical data (not linked to you)', action: 'keep', period: 'Indefinitely' },
];

function Steps({ current }) {
  const list = ['Login', 'Review', 'Confirm'];
  return (
    <div className="steps">
      {list.map((lbl, i) => {
        const n = i + 1;
        return (
          <div key={lbl} className={`step${n === current ? ' active' : ''}${n < current ? ' done' : ''}`}>
            <div className="step-num">
              {n < current ? <CheckIcon size={14} /> : n}
            </div>
            <span className="step-lbl">{lbl}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DeletePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [confirmEmail, setConfirmEmail] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (!user) navigate('/', { replace: true }); }, [user, navigate]);
  if (!user) return null;

  const emailMatch = confirmEmail.trim().toLowerCase() === user.email.toLowerCase();
  const canDelete  = emailMatch && understood;

  const handleDelete = async () => {
    if (!canDelete) return;
    setLoading(true); setError('');
    try {
      await deleteAccount(user.id);
      logout();
      navigate('/success', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-bg" />
      <div className="page-wrapper top" style={{ paddingTop: 36 }}>
        <div className="card card-medium">
          <Steps current={3} />

          {/* Header */}
          <div className="text-center" style={{ marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--c-danger-light)',
              border: '3px solid var(--c-danger-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <TrashIcon size={26} style={{ color: 'var(--c-danger)' }} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text-700)' }}>
              Delete Account
            </h1>
            <p className="text-sm text-muted mt-8" style={{ maxWidth: 400, margin: '8px auto 0', lineHeight: 1.6 }}>
              This action is <strong style={{ color: 'var(--c-text-700)' }}>permanent and irreversible</strong>.
              Please read carefully before proceeding.
            </p>
          </div>

          {/* Warning */}
          <div className="alert alert-warn">
            <AlertIcon size={16} />
            <span>
              This will permanently remove your ReConnect account from all platforms including the
              mobile app. You will <strong>not</strong> be able to recover your data.
            </span>
          </div>

          {/* Data policy table */}
          <div className="mt-20">
            <div className="flex items-center gap-8" style={{ marginBottom: 8 }}>
              <InfoIcon size={15} style={{ color: 'var(--c-primary)' }} />
              <span className="section-title" style={{ fontSize: '0.92rem' }}>What happens to your data</span>
            </div>
            <div className="data-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Data Type</th><th>Action</th><th>Retention</th></tr>
                </thead>
                <tbody>
                  {DATA_ROWS.map(r => (
                    <tr key={r.type}>
                      <td>{r.type}</td>
                      <td>
                        <span className={`tag tag-${r.action}`}>
                          {r.action === 'del' ? <TrashIcon size={10} /> : <InfoIcon size={10} />}
                          {r.action === 'del' ? 'Deleted' : 'Retained (anon.)'}
                        </span>
                      </td>
                      <td className="text-muted" style={{ fontSize: '0.83rem' }}>{r.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Confirm email — matches Flutter's text input style */}
          <div className="form-group mt-24">
            <label htmlFor="confirm-email" className="form-label">
              Type your email address to confirm
            </label>
            <input
              id="confirm-email"
              type="email"
              className={`form-input${confirmEmail && emailMatch ? ' ok' : ''}`}
              placeholder={user.email}
              value={confirmEmail}
              onChange={e => setConfirmEmail(e.target.value)}
              autoComplete="off"
              disabled={loading}
            />
            {confirmEmail && !emailMatch && (
              <span className="field-err">Email does not match your account email</span>
            )}
            {emailMatch && (
              <span className="field-ok">
                <CheckIcon size={13} color="var(--c-success)" /> Email confirmed
              </span>
            )}
          </div>

          {/* Checkbox */}
          <div className="mt-14">
            <label className="checkbox-row" htmlFor="understood-check">
              <input
                id="understood-check" type="checkbox"
                checked={understood}
                onChange={e => setUnderstood(e.target.checked)}
                disabled={loading}
              />
              <div className={`chk-box${understood ? ' on' : ''}`}>
                {understood && <CheckIcon size={12} color="#fff" />}
              </div>
              <span className="chk-label">
                I understand this action is permanent and cannot be undone.
              </span>
            </label>
          </div>

          {/* Error banner */}
          {error && (
            <div className="err-banner mt-16">
              <AlertIcon size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-12 mt-24">
            <button
              id="cancel-delete-btn"
              className="btn btn-outline"
              style={{ flex: 1 }}
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              id="confirm-delete-btn"
              className="btn btn-danger"
              style={{ flex: 2 }}
              onClick={handleDelete}
              disabled={!canDelete || loading}
            >
              {loading
                ? <><span className="spin" /> Deleting…</>
                : <><TrashIcon size={15} /> Permanently Delete</>
              }
            </button>
          </div>

          <p className="text-center text-xs text-muted mt-16">
            Need help?{' '}
            <a
              href="mailto:support@reconnectapp.in?subject=Account%20Deletion%20Request"
              className="link"
              style={{ fontSize: 'inherit' }}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

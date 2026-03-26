import { CheckIcon, InfoIcon } from '../components/Icons';

const DELETED = [
  'Profile information (name, email, phone, gender, date of birth)',
  'Address and Aadhar number',
  'Login credentials and password',
  'Case reports and missing person sightings',
  'Uploaded photos and media',
];
const RETAINED = [
  'Anonymised statistical data that cannot be linked back to you',
];

export default function SuccessPage() {
  return (
    <>
      <div className="page-bg" />
      <div className="page-wrapper">
        <div className="card card-medium" style={{ textAlign: 'center' }}>
          {/* Success icon */}
          <div className="success-icon">
            <CheckIcon size={42} color="var(--c-success)" />
          </div>

          <img
            src="/reconnect_logo.png"
            alt="ReConnect"
            style={{ height: 54, margin: '0 auto 16px', display: 'block' }}
          />

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--c-text-700)' }}>
            Account Deleted
          </h1>
          <p className="text-sm text-muted mt-8" style={{ maxWidth: 400, margin: '10px auto 0', lineHeight: 1.65 }}>
            Your ReConnect account and associated personal data have been permanently removed
            from our system.
          </p>

          {/* Deleted list */}
          <div style={{
            background: 'var(--c-danger-light)', border: '1px solid var(--c-danger-border)',
            borderRadius: 16, padding: '18px 22px', marginTop: 24, textAlign: 'left',
          }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--c-danger)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Permanently Deleted
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {DELETED.map(item => (
                <li key={item} style={{ fontSize: '0.87rem', color: '#7f1d1d', display: 'flex', gap: 8 }}>
                  <span style={{ flexShrink: 0 }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Retained list */}
          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 16, padding: '18px 22px', marginTop: 12, textAlign: 'left',
          }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e40af', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5 }}>
              <InfoIcon size={13} /> Retained (Anonymised)
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {RETAINED.map(item => (
                <li key={item} style={{ fontSize: '0.87rem', color: '#1e40af', display: 'flex', gap: 8 }}>
                  <span style={{ flexShrink: 0 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '0.79rem', color: '#3b82f6', marginTop: 8, fontStyle: 'italic' }}>
              This data cannot be traced back to your identity.
            </p>
          </div>

          {/* Retention notice */}
          <div className="alert alert-info mt-16" style={{ textAlign: 'left' }}>
            <InfoIcon size={15} />
            <span>
              All personal data is fully purged within <strong>30 days</strong>. Encrypted backups
              may persist up to 90 days before being overwritten.
            </span>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 24, paddingTop: 20,
            borderTop: '1px solid var(--c-input-border)',
          }}>
            <p className="text-xs text-muted">
              ReConnect — Missing Person Detection App &nbsp;·&nbsp;
              <a href="mailto:support@reconnectapp.in" className="link" style={{ fontSize: 'inherit' }}>
                support@reconnectapp.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

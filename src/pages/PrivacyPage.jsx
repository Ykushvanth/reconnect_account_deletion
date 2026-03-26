import { Link } from 'react-router-dom';
import { ShieldIcon } from '../components/Icons';

export default function PrivacyPage() {
  return (
    <>
      <div className="bg-orbs" />
      <div className="page-wrapper align-top" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="card card-medium" style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--c-grad)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ShieldIcon size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--c-text-900)' }}>
                Privacy Policy
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--c-text-500)', marginTop: 2 }}>
                ReConnect — Missing Person Detection App
              </p>
            </div>
          </div>

          {[
            ['Data We Collect', 'We collect your name, email address, phone number, date of birth, gender, address, and Aadhar number to create and maintain your ReConnect account.'],
            ['How We Use Your Data', 'Your data is used solely to operate the ReConnect missing person detection service, including case reporting, sighting submissions, and community coordination.'],
            ['Data Security', 'All data is encrypted in transit using TLS. Passwords are stored as BCrypt hashes. We never store plain-text credentials.'],
            ['Account Deletion', 'You may request deletion of your account and all associated personal data at any time using this portal. Personal data is purged within 30 days of a verified deletion request. Anonymised statistical data not linked to your identity may be retained.'],
            
          ].map(([title, text]) => (
            <div key={title} style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--c-text-900)', marginBottom: 6 }}>
                {title}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--c-text-500)', lineHeight: 1.7 }}>{text}</p>
            </div>
          ))}

          <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', marginTop: 8 }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </>
  );
}

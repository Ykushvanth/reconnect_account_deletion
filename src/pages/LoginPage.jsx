import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWithEmailPassword, requestPasswordResetEmail } from '../lib/auth';
import { EyeIcon, EyeOffIcon, AlertIcon, CheckIcon } from '../components/Icons';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErr, setFieldErr] = useState({});
  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (mode === 'forgot') {
      queueMicrotask(() => emailRef.current?.focus());
    }
  }, [mode]);

  const validateLogin = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Must be at least 6 characters';
    setFieldErr(e);
    return !Object.keys(e).length;
  };

  const validateForgot = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    setFieldErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true); setError('');
    try {
      const userData = await loginWithEmailPassword(email.trim(), password);
      login(userData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!validateForgot()) return;
    setLoading(true); setError(''); setNotice('');
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      await requestPasswordResetEmail(email, { redirectTo });
      setNotice('If an account exists for this email, we sent a password reset link. Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-bg" />
      <div className="page-wrapper">
        <div className="card">
          {/* Logo block — matches Flutter login _buildHeader() */}
          <div className="logo-block">
            <img src="/reconnect_logo.png" alt="ReConnect" />
            <h1>Login to Delete Account</h1>
            <p>Sign in with your ReConnect account<br />to continue the account deletion request.</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="err-banner mt-16">
              <AlertIcon size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Notice banner */}
          {notice && (
            <div className="alert alert-info mt-16">
              <AlertIcon size={16} />
              <span>{notice}</span>
            </div>
          )}

          {/* Email */}
          <form
            onSubmit={mode === 'forgot' ? handleForgot : handleSubmit}
            noValidate
            className="mt-20"
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Address *</label>
              <input
                id="login-email"
                type="email"
                className={`form-input${fieldErr.email ? ' err' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setFieldErr(p => ({ ...p, email: '' })); setNotice(''); setError(''); }}
                autoComplete="email"
                disabled={loading}
                ref={emailRef}
              />
              {fieldErr.email && <span className="field-err">{fieldErr.email}</span>}
            </div>

            {mode === 'login' && (
              <>
                {/* Password */}
                <div className="form-group">
                  <label htmlFor="login-password" className="form-label">Password *</label>
                  <div className="input-wrap">
                    <input
                      id="login-password"
                      type={showPwd ? 'text' : 'password'}
                      className={`form-input${fieldErr.password ? ' err' : ''}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setFieldErr(p => ({ ...p, password: '' })); }}
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="toggle-pwd"
                      onClick={() => setShowPwd(v => !v)}
                      tabIndex={-1}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                    >
                      {showPwd ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                  {fieldErr.password && <span className="field-err">{fieldErr.password}</span>}
                </div>

                {/* Remember me row + Forgot — matches Flutter _buildFormOptions */}
                <div className="flex items-center justify-between">
                  <label className="checkbox-row" htmlFor="remember-me">
                    <input
                      id="remember-me" type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <div className={`chk-box${rememberMe ? ' on' : ''}`}>
                      {rememberMe && <CheckIcon size={12} color="#fff" />}
                    </div>
                    <span className="chk-label">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="link"
                    style={{ fontSize: '0.87rem' }}
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setNotice('Enter your email, then click “Send reset link”.');
                    }}
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit button — #667eea exactly like Flutter */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                  style={{ marginTop: 4 }}
                >
                  {loading ? <><span className="spin" /> Signing In…</> : 'Sign In'}
                </button>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  Enter your email and we’ll send a link to reset your password.
                </p>
                <button
                  id="forgot-submit-btn"
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                  style={{ marginTop: 4 }}
                >
                  {loading ? <><span className="spin" /> Sending…</> : 'Send reset link'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-full"
                  onClick={() => { setMode('login'); setError(''); setNotice(''); }}
                  disabled={loading}
                >
                  Back to Sign In
                </button>
              </>
            )}
          </form>

          {/* Divider & footer note */}
          <div style={{ borderTop: '1px solid var(--c-input-border)', marginTop: 22, paddingTop: 18 }}>
            <p className="text-center text-sm text-muted" style={{ lineHeight: 1.6 }}>
              This portal is only for deleting your ReConnect account.
              To create an account, download the <strong style={{ color: 'var(--c-text-700)' }}>ReConnect app</strong>.
            </p>
            <p className="text-center text-xs text-muted mt-8">
              <Link to="/privacy" className="link" style={{ fontSize: 'inherit' }}>Privacy Policy</Link>
              {' '}·{' '}Your data is encrypted in transit
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

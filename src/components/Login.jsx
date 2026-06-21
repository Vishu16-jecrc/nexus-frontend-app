import React, { useState } from 'react';
import { User, Lock, Mail, LogIn, UserPlus, Eye, EyeOff, Terminal, ShieldAlert, KeyRound } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setShowOtpScreen(false);
    setUsername('');
    setEmail('');
    setPassword('');
    setOtp('');
    setAlertMsg('');
  };

  const handleInitiateRegister = async (e) => {
    e.preventDefault();
    setAlertMsg('');

    if (!username || !password || !email) {
      setAlertType('error');
      setAlertMsg('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlertType('error');
      setAlertMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setAlertType('error');
      setAlertMsg('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register-initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await res.json();

      if (res.ok) {
        setAlertType('success');
        const successMessage = data.otp
          ? `[DEVELOPER BYPASS] USE CODE: ${data.otp}`
          : 'OTP generated successfully and sent to your email!';
        setAlertMsg(successMessage);
        setShowOtpScreen(true);
      } else {
        setAlertType('error');
        setAlertMsg(data.error || 'Registration failed.');
      }
    } catch (err) {
      setAlertType('error');
      setAlertMsg('Backend connection anomaly. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAlertMsg('');

    if (!otp) {
      setAlertType('error');
      setAlertMsg('Please enter the OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setAlertType('success');
        setAlertMsg('Identity Verified! Redirecting to Login panel...');
        setTimeout(() => {
          setShowOtpScreen(false);
          setIsLogin(true);
          setOtp('');
          setPassword('');
          setEmail('');
          setAlertMsg('');
        }, 1800);
      } else {
        setAlertType('error');
        setAlertMsg(data.error || 'OTP verification failed.');
      }
    } catch (err) {
      setAlertType('error');
      setAlertMsg('Connection anomaly during OTP verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAlertMsg('');

    if (!username || !password) {
      setAlertType('error');
      setAlertMsg('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      if (username.toLowerCase() === 'admin') {
        const res = await fetch(`${API_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (res.ok) {
          setAlertType('success');
          setAlertMsg('Admin clearance accepted. Initializing Console...');
          setTimeout(() => {
            onLoginSuccess({ username: 'admin', token: data.token, isAdmin: true });
          }, 1200);
        } else {
          setAlertType('error');
          setAlertMsg(data.error || 'Invalid Admin token.');
        }
      } else {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (res.ok) {
          setAlertType('success');
          setAlertMsg('Session initialized. Access Granted.');
          setTimeout(() => {
            onLoginSuccess({ username: data.username, token: data.token, isAdmin: false });
          }, 1200);
        } else {
          setAlertType('error');
          setAlertMsg(data.error || 'Incorrect User ID or Password.');
        }
      }
    } catch (err) {
      setAlertType('error');
      setAlertMsg('Connection anomaly. Check backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel float-element" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBox}>
            <Terminal size={24} style={styles.logoIcon} />
          </div>
          <h1 className="text-neon" style={styles.title}>
            {showOtpScreen ? 'NEXUS.OTP_VERIFY' : isLogin ? 'NEXUS.LOGIN' : 'NEXUS.SIGNUP'}
          </h1>
          <p style={styles.subtitle}>
            {showOtpScreen
              ? 'Multi-factor authentication'
              : isLogin
              ? 'Enter security credentials'
              : 'Create new profile'}
          </p>
        </div>

        {/* 1. OTP Verification Screen */}
        {showOtpScreen ? (
          <form onSubmit={handleVerifyOtp} style={styles.form}>
            <div style={styles.otpInstructions}>
              &gt; OTP code sent to <strong>{email}</strong>. Check your inbox to retrieve the verification token.
            </div>

            <div className="input-group">
              <label className="input-label">6-Digit Access Code</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  autoComplete="one-time-code"
                />
                <KeyRound size={20} className="input-icon" />
              </div>
            </div>

            {alertMsg && (
              <div className={`neon-alert neon-alert-${alertType}`}>
                <ShieldAlert size={18} />
                <span>{alertMsg}</span>
              </div>
            )}

            <button type="submit" className="btn-neon" style={styles.submitBtn} disabled={isLoading}>
              Verify & Save Profile
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '12px' }}
              onClick={() => {
                setShowOtpScreen(false);
                setAlertMsg('');
              }}
            >
              Back to Registration
            </button>
          </form>
        ) : (
          /* 2. Login & Sign Up Form */
          <form onSubmit={isLogin ? handleLogin : handleInitiateRegister} style={styles.form}>
            {/* Username Input */}
            <div className="input-group">
              <label className="input-label">User ID / Username</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="input-field"
                  placeholder={isLogin ? "Username (or 'admin')" : "e.g. cyber_samurai"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
                <User size={20} className="input-icon" />
              </div>
            </div>

            {/* Email Input (Sign Up Only) */}
            {!isLogin && (
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    className="input-field"
                    placeholder="e.g. coder@nexus.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  <Mail size={20} className="input-icon" />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="input-group">
              <label className="input-label">Access Token / Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder={username.toLowerCase() === 'admin' ? "admin_secure_gate" : "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <Lock size={20} className="input-icon" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? (
                    <EyeOff size={18} style={styles.eyeIcon} />
                  ) : (
                    <Eye size={18} style={styles.eyeIcon} />
                  )}
                </button>
              </div>
            </div>

            {alertMsg && (
              <div className={`neon-alert neon-alert-${alertType}`}>
                <ShieldAlert size={18} />
                <span>{alertMsg}</span>
              </div>
            )}

            <button type="submit" className="btn-neon" style={styles.submitBtn} disabled={isLoading}>
              {isLogin ? (
                <>
                  Initialize Session <LogIn size={18} />
                </>
              ) : (
                <>
                  Send OTP Email <UserPlus size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Auth Toggle */}
        {!showOtpScreen && (
          <div style={styles.toggleContainer}>
            <span style={styles.toggleText}>
              {isLogin ? 'New to the system?' : 'Already have access?'}
            </span>
            <button onClick={toggleAuthMode} style={styles.toggleBtn}>
              {isLogin ? 'Register Profile' : 'Log In Gate'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
    zIndex: 10,
    position: 'relative',
  },
  card: {
    width: '100%',
    maxWidth: '430px',
    padding: '40px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
  },
  logoBox: {
    background: 'rgba(0, 240, 255, 0.1)',
    borderRadius: '16px',
    padding: '12px',
    marginBottom: '16px',
    border: '1px solid rgba(0, 240, 255, 0.2)',
    boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
  },
  logoIcon: {
    color: 'var(--neon-cyan)',
    filter: 'drop-shadow(0 0 5px var(--neon-cyan))',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    letterSpacing: '0.5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  submitBtn: {
    marginTop: '10px',
    width: '100%',
  },
  eyeBtn: {
    position: 'absolute',
    right: '16px',
    background: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
  },
  eyeIcon: {
    color: 'var(--text-secondary)',
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '28px',
    fontSize: '0.85rem',
  },
  toggleText: {
    color: 'var(--text-secondary)',
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--neon-cyan)',
    fontWeight: '600',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '0.5px',
  },
  otpInstructions: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '20px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderLeft: '2px solid var(--neon-cyan)',
    fontFamily: 'var(--font-heading)',
  },
};

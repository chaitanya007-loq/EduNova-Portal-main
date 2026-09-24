import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLearner } from '../../context/LearnerContext';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

// EduNova Roles & Dashboard Tracks System
export const EDUNOVA_ROLES = [
  { id: 'school', label: 'School Student', icon: '🎓', track: 'school', route: '/dashboard/school', demoEmail: 'student@edunova.in' },
  { id: 'college', label: 'College Student', icon: '🏛️', track: 'college', route: '/dashboard/college', demoEmail: 'college@edunova.in' },
  { id: 'exam', label: 'Competitive Exams', icon: '🎯', track: 'exam', route: '/dashboard/exam', demoEmail: 'exam@edunova.in' },
  { id: 'skills', label: 'Skill & Tech Learner', icon: '💻', track: 'skills', route: '/dashboard/skills', demoEmail: 'skills@edunova.in' },
  { id: 'parent', label: 'Parent / Guardian', icon: '🛡️', track: 'school', route: '/parent/dashboard', demoEmail: 'parent@edunova.in' },
  { id: 'mentor', label: 'Peer Mentor / Tutor', icon: '🤝', track: 'skills', route: '/skill-exchange', demoEmail: 'mentor@edunova.in' },
];

export const LoginPage = () => {
  const { login, loginGoogle } = useAuth();
  const { updateLearnerType } = useLearner() || {};
  const navigate = useNavigate();

  // Selected Role / Dashboard Track State (Default: School Student)
  const [selectedRoleId, setSelectedRoleId] = useState('school');

  // Email / Password state
  const [email, setEmail] = useState('student@edunova.in');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const activeRoleObj = EDUNOVA_ROLES.find(r => r.id === selectedRoleId) || EDUNOVA_ROLES[0];

  // Role Pill Selection Handler
  const handleSelectRole = (role) => {
    setSelectedRoleId(role.id);
    setError('');
    // Auto update demo credentials based on selected role
    if (role.id === 'parent') {
      setEmail('parent@edunova.in');
      setPassword('parent123');
    } else {
      setEmail('student@edunova.in');
      setPassword('student123');
    }
  };

  // 1. Email/Password Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      if (activeRoleObj.id === 'parent') {
        // Log in as Parent
        await login(email, password);
        if (updateLearnerType) updateLearnerType('school');
        navigate('/parent/dashboard');
      } else {
        // Log in as Student / Learner Role
        const result = await login(email, password);
        if (updateLearnerType) updateLearnerType(activeRoleObj.track);
        navigate(activeRoleObj.route || '/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Google Login Callback
  const handleGoogleSuccess = async (idToken) => {
    setLoading(true);
    setError('');
    try {
      await loginGoogle(
        idToken,
        activeRoleObj.id === 'parent' ? 'PARENT' : 'STUDENT',
        activeRoleObj.track.toUpperCase()
      );
      if (updateLearnerType) updateLearnerType(activeRoleObj.track);
      navigate(activeRoleObj.id === 'parent' ? '/parent/dashboard' : activeRoleObj.route);
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill demo credentials
  const fillRoleDemo = () => {
    setAuthMode('email');
    if (activeRoleObj.id === 'parent') {
      setEmail('parent@edunova.in');
      setPassword('parent123');
    } else {
      setEmail('student@edunova.in');
      setPassword('student123');
    }
    setError('');
  };

  return (
    <div
      className="edunova-auth-card"
      data-theme="dark"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '38px 34px',
        position: 'relative',
        borderRadius: '28px',
        color: '#ffffff'
      }}
    >
      {/* Top Header Controls */}
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.84rem',
            fontWeight: 700,
            color: '#38bdf8',
            textDecoration: 'none',
            padding: '7px 16px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.25s ease',
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <span style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
          <ShieldCheck size={15} color="#34d399" /> PostgreSQL Protected
        </span>
      </div>

      {/* Main Tagline Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', marginBottom: '10px' }}>
          <Sparkles size={14} color="#38bdf8" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>EduNova Ecosystem</span>
        </div>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
          EduNova Portal
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', margin: 0, fontWeight: 600 }}>
          Smart AI-powered learning starts here 🚀
        </p>
      </div>

      {/* 1. MASTER MODE SWITCHER BAR: [ LOGIN | SIGN UP ] */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: 'rgba(5, 8, 22, 0.55)',
          padding: '6px',
          borderRadius: '20px',
          marginBottom: '22px',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <button
          type="button"
          style={{
            padding: '12px',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #8b5cf6 100%)',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '0.95rem',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(56, 189, 248, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
          }}
        >
          <LogIn size={18} /> Login
        </button>

        <button
          type="button"
          onClick={() => navigate('/register')}
          style={{
            padding: '12px',
            borderRadius: '15px',
            background: 'transparent',
            color: '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <UserPlus size={18} /> Sign Up
        </button>
      </div>

      {/* 2. ROLE / DASHBOARD SELECTOR GRID */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Sparkles size={14} color="#38bdf8" />
          <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Select Role / Dashboard Track
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px'
        }}>
          {EDUNOVA_ROLES.map((role) => {
            const isSelected = selectedRoleId === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelectRole(role)}
                style={{
                  padding: '11px 14px',
                  borderRadius: '16px',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.28) 0%, rgba(139, 92, 246, 0.28) 100%)'
                    : 'rgba(255, 255, 255, 0.045)',
                  border: isSelected
                    ? '1.5px solid #38bdf8'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  boxShadow: isSelected
                    ? '0 8px 25px rgba(56, 189, 248, 0.35), inset 0 1px 1.5px rgba(255, 255, 255, 0.4)'
                    : 'none',
                  backdropFilter: 'blur(16px)',
                  transform: isSelected ? 'translateY(-1px)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{role.icon}</span>
                  <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '-0.01em'
                  }}>
                    {role.label}
                  </span>
                </div>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}>
                  {isSelected && <CheckCircle2 size={12} color="#0f172a" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(244, 63, 94, 0.18)', color: '#fda4af', borderRadius: '14px', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid rgba(244, 63, 94, 0.4)', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {info && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.18)', color: '#6ee7b7', borderRadius: '14px', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 600 }}>
          {info}
        </div>
      )}

      {/* Google Login Button */}
      <div style={{ marginBottom: '20px' }}>
        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={(err) => setError(err.message)}
          loading={loading}
          text={`Continue with Google as ${activeRoleObj.label}`}
        />
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '20px 0', opacity: 0.85 }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.18)' }} />
        <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
          or sign in with
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.18)' }} />
      </div>

      {/* Email / Password Form */}
      <>
          {/* Quick Demo Fill Pill */}
          <div
            onClick={fillRoleDemo}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px dashed rgba(56, 189, 248, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.2s ease',
            }}
            title={`Click to auto-fill ${activeRoleObj.label} demo account`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>
                Demo {activeRoleObj.label}: <strong style={{ color: '#38bdf8' }}>{email}</strong>
              </span>
            </div>
            <span style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 800 }}>Auto-fill →</span>
          </div>

          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '0.83rem', color: '#cbd5e1', marginBottom: '7px', display: 'block', fontWeight: 700 }}>
                Email Address <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeRoleObj.demoEmail}
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    paddingTop: '13px',
                    paddingBottom: '13px',
                    boxSizing: 'border-box',
                    background: 'rgba(6, 10, 26, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    backdropFilter: 'blur(12px)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label style={{ fontSize: '0.83rem', color: '#cbd5e1', fontWeight: 700 }}>
                  Password <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
                  (Argon2id Encrypted)
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    paddingLeft: '44px',
                    paddingRight: '44px',
                    paddingTop: '13px',
                    paddingBottom: '13px',
                    boxSizing: 'border-box',
                    background: 'rgba(6, 10, 26, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    backdropFilter: 'blur(12px)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.83rem', color: '#cbd5e1', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#38bdf8', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Remember me on this device
              </label>
            </div>
            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
              <Link to="/forgot-password" style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '14px 20px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontWeight: 900,
                fontSize: '0.98rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 30px rgba(2, 132, 199, 0.45)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <LogIn size={19} /> {loading ? 'Signing In...' : `Sign In as ${activeRoleObj.label}`}
            </button>
          </form>
      </>

      {/* Footer Link to Register */}
      <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.88rem', color: '#94a3b8' }}>
        Don't have an account yet?{' '}
        <Link to="/register" style={{ color: '#38bdf8', fontWeight: 800, textDecoration: 'none' }}>
          Create Free Account →
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;

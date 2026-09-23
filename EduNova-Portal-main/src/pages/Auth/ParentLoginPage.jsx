import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LogIn, User, Lock, Eye, EyeOff, ArrowLeft, HeartHandshake, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

export const ParentLoginPage = () => {
  const { loginParent } = useAuth();
  const navigate = useNavigate();

  const [studentUsername, setStudentUsername] = useState('aarav_sharma');
  const [parentPassword, setParentPassword] = useState('parent123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginParent(studentUsername, parentPassword);
      navigate('/parent-dashboard');
    } catch (err) {
      setError(err.message || 'Parent login failed. Please check student username and parent password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoParent = () => {
    setStudentUsername('aarav_sharma');
    setParentPassword('parent123');
  };

  return (
    <div className="edunova-auth-card" data-theme="dark" style={{ width: '100%', boxSizing: 'border-box', padding: '36px 32px', position: 'relative', borderRadius: '28px', color: '#ffffff' }}>
      {/* Top Header Row with Back Button */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#38bdf8',
            textDecoration: 'none',
            padding: '7px 15px',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.14)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#34d399" /> Student Privacy Firewall Protected
        </span>
      </div>

      {/* Main Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '10px' }}>
          <HeartHandshake size={16} color="#10b981" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981' }}>Parent Portal 2.0</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.02em', color: '#ffffff' }}>
          EDUNOVA <span className="gradient-text-animated" style={{ background: 'linear-gradient(135deg, #10b981 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Parent Portal</span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', maxWidth: '420px', margin: '0 auto' }}>
          "Stay connected with your child's learning journey."
        </p>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', borderRadius: '14px', fontSize: '0.85rem', marginBottom: '18px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          {error}
        </div>
      )}

      {/* Quick Demo Fill Pill */}
      <div
        onClick={fillDemoParent}
        style={{
          padding: '12px 16px',
          borderRadius: '14px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px dashed #10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: '20px',
          transition: 'all 0.2s ease'
        }}
        title="Click to auto-fill demo parent credentials"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#10b981" />
          <span style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>Demo Parent Account: <strong style={{ color: '#10b981' }}>@aarav_sharma</strong></span>
        </div>
        <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 800 }}>Auto-fill →</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Student Username Field */}
        <div>
          <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
            Student Username <span style={{ color: '#f43f5e' }}>* Required</span>
          </label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
            <input
              type="text"
              value={studentUsername}
              onChange={(e) => setStudentUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="e.g. aarav_sharma"
              style={{ width: '100%', paddingLeft: '40px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
              required
            />
          </div>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
            Enter your child's EduNova username (e.g. aarav_sharma, alex123)
          </span>
        </div>

        {/* Parent Password Field */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 700 }}>
              Parent Password <span style={{ color: '#f43f5e' }}>* Required</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, cursor: 'pointer' }}
            >
              Forgot Password?
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={parentPassword}
              onChange={(e) => setParentPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#cbd5e1' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
            />
            Remember parent access on this browser
          </label>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '6px',
            padding: '14px 20px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            fontWeight: 800,
            fontSize: '0.94rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.38)'
          }}
        >
          <LogIn size={18} /> {loading ? 'Authenticating Parent Access...' : 'Login to Parent Portal'}
        </button>
      </form>

      {/* Secondary Action: Create Parent Account */}
      <div style={{ textAlign: 'center', marginTop: '22px', borderTop: '1px solid rgba(255, 255, 255, 0.14)', paddingTop: '18px' }}>
        <Link
          to="/parent-register"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#10b981',
            fontWeight: 800,
            fontSize: '0.88rem',
            textDecoration: 'none'
          }}
        >
          <HeartHandshake size={16} /> Create Parent Account →
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.82rem', color: '#94a3b8' }}>
        Are you a student?{' '}
        <Link to="/login" style={{ color: '#38bdf8', fontWeight: 800, textDecoration: 'none' }}>Student Login →</Link>
      </div>

      {/* MODAL 1: CREATE PARENT ACCESS INFO */}
      {showAccessModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(5, 8, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#0c1133',
            borderRadius: '24px',
            border: '1px solid #10b981',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
            color: '#ffffff'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartHandshake size={20} /> Create Parent Access
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
              Parent access is linked to your child's student account. Students can also send a parent invitation from their Student Settings.
            </p>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.06)', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '18px' }}>
              💡 <strong>Default Demo Credentials:</strong><br />
              • Student Username: <code>aarav_sharma</code><br />
              • Parent Password: <code>parent123</code>
            </div>
            <Button size="sm" onClick={() => setShowAccessModal(false)} style={{ width: '100%' }}>
              Got It, Continue to Login
            </Button>
          </div>
        </div>
      )}

      {/* MODAL 2: FORGOT PASSWORD INFO */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(5, 8, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#0c1133',
            borderRadius: '24px',
            border: '1px solid #38bdf8',
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
            color: '#ffffff'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={20} /> Parent Password Recovery
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
              Parent passwords can be reset via the registered parent email address or directly by the student in Student Settings.
            </p>
            <Button size="sm" onClick={() => setShowForgotModal(false)} style={{ width: '100%' }}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentLoginPage;

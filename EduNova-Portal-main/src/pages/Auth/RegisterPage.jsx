import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLearner } from '../../context/LearnerContext';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';
import {
  UserPlus,
  LogIn,
  User,
  Mail,
  Lock,
  Phone,
  AtSign,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { EDUNOVA_ROLES } from './LoginPage';

export const RegisterPage = () => {
  const { register, loginGoogle } = useAuth();
  const { updateLearnerType } = useLearner() || {};
  const navigate = useNavigate();

  // Selected Role / Track (Default: School Student)
  const [selectedRoleId, setSelectedRoleId] = useState('school');

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const activeRoleObj = EDUNOVA_ROLES.find(r => r.id === selectedRoleId) || EDUNOVA_ROLES[0];

  const handleNameChange = (val) => {
    setName(val);
    if (!username) {
      const suggested = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
      setUsername(suggested);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalName = name.trim() || 'EduNova Learner';
      const finalEmail = email.trim() || `${username}@edunova.io`;
      const finalUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

      const learnerTrack = activeRoleObj.track || 'school';
      await register(finalName, finalEmail, password || 'secret', learnerTrack.toUpperCase(), {
        username: finalUsername,
        phone: phone.trim(),
        role: activeRoleObj.id === 'parent' ? 'PARENT' : 'STUDENT'
      });

      if (updateLearnerType) {
        updateLearnerType(activeRoleObj.track, {
          name: finalName,
          username: finalUsername,
          phone: phone.trim()
        });
      }

      navigate(activeRoleObj.id === 'parent' ? '/parent/dashboard' : activeRoleObj.route);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken) => {
    setLoading(true);
    setError('');
    try {
      await loginGoogle(
        idToken,
        activeRoleObj.id === 'parent' ? 'PARENT' : 'STUDENT',
        activeRoleObj.track.toUpperCase()
      );
      if (updateLearnerType) updateLearnerType(activeRoleObj.track, { name: 'EduNova Learner' });
      navigate(activeRoleObj.id === 'parent' ? '/parent/dashboard' : activeRoleObj.route);
    } catch (err) {
      setError(err.message || 'Google registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="edunova-auth-card"
      data-theme="dark"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '36px 32px',
        position: 'relative',
        borderRadius: '28px',
        background: 'linear-gradient(145deg, rgba(20, 28, 65, 0.85) 0%, rgba(10, 15, 38, 0.94) 60%, rgba(18, 12, 45, 0.88) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.65), 0 0 40px rgba(56, 189, 248, 0.18), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.35)',
        backdropFilter: 'blur(32px) saturate(190%)',
        WebkitBackdropFilter: 'blur(32px) saturate(190%)',
        color: '#ffffff'
      }}
    >
      {/* Back Button Header */}
      <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.14)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#34d399" /> Verified Registration
        </span>
      </div>

      {/* Main Tagline Header */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
          Create EduNova Account
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0, fontWeight: 600 }}>
          Smart AI-powered learning starts here 🚀
        </p>
      </div>

      {/* 1. MASTER MODE SWITCHER BAR: [ LOGIN | SIGN UP ] (Matching Reference Image) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: 'rgba(5, 8, 22, 0.85)',
          padding: '6px',
          borderRadius: '20px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.5)'
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/login')}
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
          <LogIn size={18} /> Login
        </button>

        <button
          type="button"
          style={{
            padding: '12px',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '0.95rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(2, 132, 199, 0.5)'
          }}
        >
          <UserPlus size={18} /> Sign Up
        </button>
      </div>

      {/* 2. ROLE / DASHBOARD SELECTOR GRID */}
      <div style={{ marginBottom: '22px' }}>
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
                onClick={() => { setSelectedRoleId(role.id); setError(''); }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '16px',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.28) 0%, rgba(99, 102, 241, 0.28) 100%)'
                    : 'rgba(255, 255, 255, 0.04)',
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
                    ? '0 8px 24px rgba(56, 189, 248, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.35)'
                    : 'none',
                  backdropFilter: 'blur(12px)',
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

      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.15)', color: '#fb7185', borderRadius: '14px', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid rgba(244,63,94,0.3)' }}>
          {error}
        </div>
      )}

      {/* Google Sign-Up Button */}
      <div style={{ marginBottom: '18px' }}>
        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          onError={(err) => setError(err.message)}
          loading={loading}
          text={`Sign Up with Google as ${activeRoleObj.label}`}
        />
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0', opacity: 0.85 }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.18)' }} />
        <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
          or register with details
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.18)' }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Full Name & Username */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
              Full Name <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
              <input
                type="text"
                placeholder="e.g. Alex Mercer"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', paddingTop: '10px', paddingBottom: '10px', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
              Username <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <AtSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
              <input
                type="text"
                placeholder="alex_mercer"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                style={{ width: '100%', paddingLeft: '38px', paddingTop: '10px', paddingBottom: '10px', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>
        </div>

        {/* Email & Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
              Email Address <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
              <input
                type="email"
                placeholder="alex@edunova.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', paddingTop: '10px', paddingBottom: '10px', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
              Phone Number <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', paddingTop: '10px', paddingBottom: '10px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
            Password <span style={{ color: '#f43f5e' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', paddingLeft: '38px', paddingRight: '38px', paddingTop: '10px', paddingBottom: '10px', boxSizing: 'border-box' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '13px 20px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            fontWeight: 800,
            fontSize: '0.94rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 30px rgba(2, 132, 199, 0.45)',
          }}
        >
          <UserPlus size={18} /> {loading ? 'Creating Account...' : `Create Account as ${activeRoleObj.label}`}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: '#94a3b8' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#38bdf8', fontWeight: 800, textDecoration: 'none' }}>
          Log In →
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;

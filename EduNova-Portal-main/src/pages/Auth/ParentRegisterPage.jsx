import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { HeartHandshake, User, Mail, Lock, Phone, AtSign, ArrowLeft, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

export const ParentRegisterPage = () => {
  const { registerParent } = useAuth();
  const navigate = useNavigate();

  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [studentUsername, setStudentUsername] = useState('aarav_sharma');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentUsername.trim()) {
      setError('Student Username is required to connect parent access.');
      return;
    }
    if (!parentName.trim() || !parentEmail.trim() || !parentPassword.trim()) {
      setError('Please fill in all required parent details.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerParent(
        parentName.trim(),
        parentEmail.trim(),
        parentPassword,
        studentUsername.trim(),
        phone.trim()
      );
      navigate('/parent-dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Parent registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edunova-auth-card" data-theme="dark" style={{ width: '100%', boxSizing: 'border-box', padding: '36px 32px', position: 'relative', borderRadius: '28px', color: '#ffffff' }}>
      {/* Top Header Row with Back Button */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/parent-login"
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
          <ArrowLeft size={16} /> Back to Parent Login
        </Link>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#10b981" /> Verified Guardian Access
        </span>
      </div>

      {/* Main Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '10px' }}>
          <HeartHandshake size={16} color="#10b981" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981' }}>Create Parent Access</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.02em', color: '#ffffff' }}>
          EduNova <span className="gradient-text-animated" style={{ background: 'linear-gradient(135deg, #10b981 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Parent Account</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', maxWidth: '440px', margin: '0 auto' }}>
          Set up guardian monitoring & AI study insights linked to your child's account
        </p>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', borderRadius: '14px', fontSize: '0.85rem', marginBottom: '18px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Parent Name & Email */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
              Parent Full Name <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
              <input
                type="text"
                placeholder="e.g. Ramesh Sharma"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', paddingTop: '10px', paddingBottom: '10px', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
              Parent Email Address <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
              <input
                type="email"
                placeholder="parent@example.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', paddingTop: '10px', paddingBottom: '10px', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>
        </div>

        {/* Student Username (Crucial linkage) */}
        <div>
          <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
            Student Username (To Connect) <span style={{ color: '#f43f5e' }}>* Required</span>
          </label>
          <div style={{ position: 'relative' }}>
            <AtSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
            <input
              type="text"
              placeholder="e.g. aarav_sharma"
              value={studentUsername}
              onChange={(e) => setStudentUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              style={{ width: '100%', paddingLeft: '38px', paddingTop: '10px', paddingBottom: '10px', boxSizing: 'border-box' }}
              required
            />
          </div>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
            Enter your child's exact EduNova username to link academic reporting.
          </span>
        </div>

        {/* Password & Phone Number */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 700 }}>
              Parent Password <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={parentPassword}
                onChange={(e) => setParentPassword(e.target.value)}
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

          <div>
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
              Phone Number <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>(For SMS alerts)</span>
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

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '8px',
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
          <HeartHandshake size={18} /> {loading ? 'Creating Parent Account...' : 'Create Parent Account'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: '#94a3b8' }}>
        Already have a parent account?{' '}
        <Link to="/parent-login" style={{ color: '#10b981', fontWeight: 800, textDecoration: 'none' }}>
          Login to Parent Portal →
        </Link>
      </div>
    </div>
  );
};

export default ParentRegisterPage;

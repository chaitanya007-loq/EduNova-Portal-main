import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../lib/apiClient';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [requested, setRequested] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const response = await authApi.requestPasswordReset(email.trim());
      setRequested(true);
      setStatus(response.data.message);
    } catch (err) {
      setError(err.message || 'Unable to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const response = await authApi.resetPassword({ email: email.trim(), code, password });
      setStatus(response.data.message);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edunova-auth-card" data-theme="dark" style={{ width: '100%', boxSizing: 'border-box', padding: '38px 34px', borderRadius: '28px', color: '#fff' }}>
      <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>
        <ArrowLeft size={16} /> Back to login
      </Link>
      <div style={{ textAlign: 'center', margin: '28px 0' }}>
        <KeyRound size={34} color="#38bdf8" />
        <h2 style={{ margin: '10px 0 6px' }}>Reset your password</h2>
        <p style={{ color: '#94a3b8', margin: 0 }}>We will send a one-time code to your registered email.</p>
      </div>
      {error && <div style={{ color: '#fda4af', marginBottom: 16 }}>{error}</div>}
      {status && <div style={{ color: '#6ee7b7', marginBottom: 16 }}>{status}</div>}
      {!requested ? (
        <form onSubmit={requestCode} style={{ display: 'grid', gap: 16 }}>
          <label>Email address<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} /></label>
          <button disabled={loading} style={buttonStyle}>{loading ? 'Sending...' : 'Send email code'}</button>
        </form>
      ) : (
        <form onSubmit={resetPassword} style={{ display: 'grid', gap: 16 }}>
          <label>6-digit email code<div style={{ position: 'relative' }}><Mail size={17} style={iconStyle} /><input required maxLength={6} pattern="\d{6}" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} style={{ ...inputStyle, paddingLeft: 42 }} /></div></label>
          <label>New password<div style={{ position: 'relative' }}><Lock size={17} style={iconStyle} /><input required minLength={8} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, paddingLeft: 42, paddingRight: 42 }} /><button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeStyle}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          <button disabled={loading} style={buttonStyle}>{loading ? 'Updating...' : 'Change password'}</button>
        </form>
      )}
    </div>
  );
};

const inputStyle = { width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '13px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(6,10,26,.65)', color: '#fff' };
const iconStyle = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' };
const eyeStyle = { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 0, color: '#94a3b8', cursor: 'pointer' };
const buttonStyle = { padding: '14px 20px', borderRadius: 14, border: 0, background: 'linear-gradient(135deg,#0284c7,#7c3aed)', color: '#fff', fontWeight: 800, cursor: 'pointer' };

export default ForgotPasswordPage;

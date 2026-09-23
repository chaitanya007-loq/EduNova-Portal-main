import React from 'react';
import { Video, X, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const MeetingRequestModal = ({ isOpen, onClose, partnerName = 'Peer Learner', onConfirmStartMeeting }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(12, 16, 36, 0.98)',
          border: isLight ? '1px solid rgba(195, 215, 245, 0.95)' : '1px solid rgba(6, 182, 212, 0.45)',
          borderRadius: '24px',
          boxShadow: isLight ? '0 20px 60px rgba(64, 100, 160, 0.2)' : '0 20px 60px rgba(0,0,0,0.8)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Animated Meeting Icon */}
        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #06b6d4, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 30px rgba(6, 182, 212, 0.4)', marginBottom: '16px' }}>
          <Video size={32} />
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', margin: '0 0 8px 0' }}>
          Start Video Call with {partnerName}?
        </h3>

        <p style={{ fontSize: '0.88rem', color: isLight ? '#475569' : '#94a3b8', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          A live meeting request will be sent directly into your conversation. When {partnerName} accepts, both of you will join the interactive 1-on-1 EduNova Video Room.
        </p>

        <div style={{ padding: '12px 16px', borderRadius: '14px', background: isLight ? 'rgba(240, 246, 255, 0.95)' : '#050814', border: isLight ? '1px solid rgba(54, 199, 244, 0.35)' : '1px solid rgba(6, 182, 212, 0.25)', fontSize: '0.78rem', color: isLight ? '#0284c7' : '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '24px' }}>
          <ShieldCheck size={16} color={isLight ? '#0284c7' : '#38bdf8'} />
          <span style={{ fontWeight: isLight ? 600 : 400 }}>Encrypted 1-on-1 Session • Screen Share & Scratchpad Enabled</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button
            onClick={onClose}
            className="se-btn se-btn-secondary"
            style={{ flex: 1, padding: '12px', fontSize: '0.85rem', justifyContent: 'center' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmStartMeeting();
              onClose();
            }}
            className="se-btn se-btn-primary"
            style={{ flex: 1, padding: '12px', fontSize: '0.85rem', justifyContent: 'center', color: '#ffffff' }}
          >
            <Video size={16} /> Start Call
          </button>
        </div>
      </div>
    </div>
  );
};

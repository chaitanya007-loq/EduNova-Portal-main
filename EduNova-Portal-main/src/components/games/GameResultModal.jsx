import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trophy, Zap, Target, Sparkles, RotateCcw, CheckSquare, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const GameResultModal = ({ isOpen, onClose, result, onRetry, onCreateTask }) => {
  const navigate = useNavigate();
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  if (!isOpen || !result) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 22, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          borderRadius: '28px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 246, 255, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(20, 30, 65, 0.95) 0%, rgba(12, 18, 42, 0.98) 100%)',
          border: isLight ? '1.5px solid rgba(255, 255, 255, 0.98)' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 65px rgba(0,0,0,0.5)',
          padding: '32px',
          textAlign: 'center'
        }}
      >
        {/* Trophy Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(234, 88, 12, 0.3))',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 35px rgba(245, 158, 11, 0.4)'
        }}>
          <Trophy size={36} color="#fbbf24" />
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.05em' }}>
          ✦ GAME COMPLETED
        </span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '4px 0 16px 0' }}>
          {result.gameTitle || 'Challenge Finished!'}
        </h2>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px',
          background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.06)',
          padding: '16px',
          borderRadius: '20px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block' }}>Score</span>
            <strong style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>{result.score}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block' }}>Accuracy</span>
            <strong style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>{result.accuracy}%</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block' }}>XP Earned</span>
            <strong style={{ fontSize: '1.4rem', fontWeight: 900, color: '#c084fc' }}>+{result.xpEarned} XP</strong>
          </div>
        </div>

        {/* Mistakes note if accuracy < 70% */}
        {result.accuracy < 70 && (
          <div style={{ padding: '12px 16px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'left' }}>
            ⚠️ Sage Recommendation: Your accuracy was {result.accuracy}%. Create a revision task to master this topic!
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              onClose();
              navigate('/ai-assistant');
            }}
            style={{
              padding: '14px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
            }}
          >
            <Sparkles size={18} /> Ask Sage AI to Explain Mistakes
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { onClose(); onRetry && onRetry(); }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '9999px',
                background: isLight ? '#ffffff' : 'rgba(255,255,255,0.1)',
                border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255,255,255,0.2)',
                color: isLight ? '#0f172a' : '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={16} /> Retry Game
            </button>

            <button
              onClick={() => { onClose(); onCreateTask && onCreateTask(result); }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '9999px',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <CheckSquare size={16} /> Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameResultModal;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, Lock, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const BadgeDetailModal = ({ achievement, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !achievement) return null;

  const percent = Math.round((achievement.progress / achievement.target) * 100);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 6, 18, 0.82)',
        backdropFilter: 'blur(12px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '500px',
          width: '100%',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Badge Large Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '3.5rem',
              width: '90px',
              height: '90px',
              borderRadius: '26px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))',
              border: '2px solid var(--accent-cyan)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(6, 182, 212, 0.4)',
              marginBottom: '16px'
            }}
          >
            {achievement.icon}
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
            <span className="cyber-badge-cyan">{achievement.rarity}</span>
            <span className="cyber-badge">{achievement.category}</span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px' }}>
            {achievement.title}
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            "{achievement.description}"
          </p>
        </div>

        {/* Status Breakdown */}
        <div style={{ background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Unlock Progress</span>
            <strong style={{ color: achievement.unlocked ? '#10b981' : 'var(--text-accent)' }}>
              {achievement.progress} / {achievement.target} ({percent}%)
            </strong>
          </div>

          <div style={{ height: '8px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden', marginBottom: '14px' }}>
            <div style={{ height: '100%', width: `${percent}%`, background: achievement.unlocked ? '#10b981' : 'linear-gradient(90deg, #06b6d4, #6366f1)', borderRadius: 'var(--radius-full)' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Reward XP:</span>
            <strong style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={14} /> +{achievement.xpReward} XP
            </strong>
          </div>
        </div>

        {/* CTA Action */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={onClose} style={{ flex: 1 }}>
            Close
          </Button>

          {!achievement.unlocked && (
            <Button
              onClick={() => {
                onClose();
                navigate('/my-subjects');
              }}
              style={{ flex: 1.5 }}
            >
              Start Recommended Action <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

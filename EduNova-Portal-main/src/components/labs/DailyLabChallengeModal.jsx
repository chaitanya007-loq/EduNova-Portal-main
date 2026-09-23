import React, { useState } from 'react';
import { X, Target, Zap, Clock, Trophy, Award, CheckCircle2, ArrowLeft } from 'lucide-react';
import { getLabById } from '../../services/labService';
import LabViewer from './LabViewer';

export const DailyLabChallengeModal = ({ challenge, isOpen, onClose, onChallengeCompleted }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen || !challenge) return null;

  const targetLab = getLabById(challenge.labId);

  const handleFinishChallenge = () => {
    setCompleted(true);
    if (onChallengeCompleted) {
      onChallengeCompleted(challenge);
    }
  };

  if (isRunning) {
    return (
      <LabViewer
        lab={targetLab}
        onClose={() => {
          setIsRunning(false);
          handleFinishChallenge();
        }}
        onAttemptRecorded={() => handleFinishChallenge()}
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(5, 8, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0b112c 0%, #050814 100%)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(168, 85, 247, 0.2)',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} /> Back to Labs
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: '16px',
              background: 'rgba(168, 85, 247, 0.2)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.4)'
            }}
          >
            <Trophy size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>
              +{challenge.rewardXP} XP Reward
            </span>
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#ffffff', fontWeight: 700 }}>
              {challenge.title}
            </h2>
          </div>
        </div>

        <div
          style={{
            padding: '16px',
            borderRadius: '14px',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
            CHALLENGE OBJECTIVE:
          </div>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.45 }}>
            {challenge.targetObjective}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="#38bdf8" /> Time Limit: {Math.floor(challenge.timeLimitSec / 60)} Mins
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="#c084fc" /> Badge: {challenge.badge}
          </span>
        </div>

        <button
          onClick={() => setIsRunning(true)}
          style={{
            padding: '14px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)'
          }}
        >
          <Zap size={18} /> Begin Challenge Now
        </button>
      </div>
    </div>
  );
};

export default DailyLabChallengeModal;

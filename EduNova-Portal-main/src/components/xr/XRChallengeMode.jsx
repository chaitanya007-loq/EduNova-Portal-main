import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const XRChallengeMode = ({ model, onSelectHotspot, onRewardXP }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const hotspots = model?.hotspots || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false);

  if (hotspots.length === 0) {
    return (
      <div style={{
        padding: '16px',
        background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(15, 23, 42, 0.6)',
        borderRadius: '14px',
        color: isLight ? '#475569' : '#94a3b8',
        fontSize: '0.84rem'
      }}>
        No hotspot challenges configured for this model.
      </div>
    );
  }

  const currentTarget = hotspots[currentIdx];

  const handleHotspotGuess = hotspot => {
    if (completed || feedback) return;

    if (hotspot.id === currentTarget.id) {
      setScore(prev => prev + 1);
      setFeedback({ success: true, text: `✓ Correct! You found ${currentTarget.name}.` });
      if (onRewardXP) onRewardXP(20, `Found ${currentTarget.name}`);
    } else {
      setFeedback({ success: false, text: `✕ Incorrect. That was ${hotspot.name}. Target was ${currentTarget.name}.` });
    }
  };

  const handleNextChallenge = () => {
    setFeedback(null);
    if (currentIdx + 1 < hotspots.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setCompleted(true);
      if (onRewardXP) onRewardXP(50, 'XR Challenge Mastery');
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setFeedback(null);
    setCompleted(false);
  };

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(245, 249, 255, 0.9) 100%)'
          : 'rgba(15, 23, 42, 0.85)',
        border: isLight ? '1.5px solid rgba(245, 158, 11, 0.45)' : '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '20px',
        padding: '20px',
        color: isLight ? '#0f172a' : '#ffffff',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: isLight ? '0 15px 40px rgba(100, 130, 200, 0.15)' : 'none'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} color={isLight ? '#d97706' : '#f59e0b'} />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: isLight ? '#d97706' : '#f59e0b' }}>
            XR Spatial Challenge
          </h4>
        </div>
        <span style={{ fontSize: '0.78rem', color: isLight ? '#b45309' : '#fbbf24', fontWeight: 800 }}>
          {currentIdx + 1} / {hotspots.length} Target
        </span>
      </div>

      {!completed ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Goal Banner */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: isLight ? 'rgba(254, 243, 199, 0.95)' : 'rgba(245, 158, 11, 0.15)',
              border: isLight ? '1.5px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)',
              color: isLight ? '#78350f' : '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 700
            }}
          >
            🎯 Goal: Click/Select "<span style={{ color: isLight ? '#b45309' : '#fbbf24', fontWeight: 800 }}>{currentTarget.name}</span>" on the 3D Canvas
          </div>

          {/* Render Clickable Hotspot Candidate Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {hotspots.map(h => (
              <button
                key={h.id}
                onClick={() => {
                  handleHotspotGuess(h);
                  if (onSelectHotspot) onSelectHotspot(h);
                }}
                disabled={!!feedback}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: isLight ? 'rgba(238, 242, 255, 0.95)' : 'rgba(30, 41, 59, 0.8)',
                  border: isLight ? '1px solid rgba(199, 210, 254, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: isLight ? '#1e40af' : '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: feedback ? 'default' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {h.name}
              </button>
            ))}
          </div>

          {feedback && (
            <div
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: feedback.success
                  ? (isLight ? 'rgba(209, 250, 229, 0.95)' : 'rgba(16, 185, 129, 0.2)')
                  : (isLight ? 'rgba(2ffe, 226, 226, 0.95)' : 'rgba(244, 63, 94, 0.2)'),
                border: feedback.success
                  ? (isLight ? '1.5px solid #10b981' : '1px solid #10b981')
                  : (isLight ? '1.5px solid #f43f5e' : '1px solid #f43f5e'),
                color: feedback.success
                  ? (isLight ? '#047857' : '#10b981')
                  : (isLight ? '#be123c' : '#f43f5e'),
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{feedback.text}</span>
              <button
                onClick={handleNextChallenge}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}
              >
                Next Target →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <Award size={40} color={isLight ? '#d97706' : '#fbbf24'} style={{ marginBottom: '8px' }} />
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>
            Challenge Completed!
          </h4>
          <p style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '0.84rem', margin: '6px 0 16px 0' }}>
            Score: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>{score} / {hotspots.length}</strong> correct target identifications.
          </p>
          <button
            onClick={handleRestart}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
            }}
          >
            <RotateCcw size={14} /> Replay Challenge
          </button>
        </div>
      )}
    </div>
  );
};

export default XRChallengeMode;

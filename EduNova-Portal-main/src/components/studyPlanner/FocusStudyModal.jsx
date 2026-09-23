import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, BookOpen, FileText, Brain, HelpCircle, X, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { studyPlannerService } from '../../services/studyPlannerService';

export const FocusStudyModal = ({ isOpen, onClose, session, onSessionCompleted }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  useEffect(() => {
    if (session) {
      const initialSecs = (session.durationMinutes || 45) * 60;
      setSecondsRemaining(initialSecs);
      setIsActive(false);
      setCompleted(false);
    }
  }, [session]);

  useEffect(() => {
    let timer = null;
    if (isActive && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      handleFinishSession();
    }
    return () => clearInterval(timer);
  }, [isActive, secondsRemaining]);

  if (!isOpen || !session) return null;

  const totalSeconds = (session.durationMinutes || 45) * 60;
  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsRemaining(totalSeconds);
  };

  const handleFinishSession = () => {
    setIsActive(false);
    const result = studyPlannerService.completeStudySession(session.id);
    setXpAwarded(result.xpAwarded || 60);
    setCompleted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }

    if (onSessionCompleted) {
      onSessionCompleted(session.id);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(8, 11, 24, 0.96)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#ffffff'
      }}
    >
      {/* Top Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#ffffff',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <X size={20} />
      </button>

      {!completed ? (
        <div style={{ maxWidth: '640px', width: '100%', textAlign: 'center' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#a5b4fc',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px'
            }}
          >
            <Sparkles size={16} /> FOCUS STUDY MODE
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px', color: '#f8fafc' }}>
            {session.subjectName}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '24px' }}>
            {session.topic}
          </p>

          {/* Objective Box */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '18px 24px',
              marginBottom: '32px',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8', fontWeight: 700 }}>
              Today's Objective
            </span>
            <p style={{ fontSize: '0.98rem', color: '#e2e8f0', marginTop: '6px', lineHeight: 1.5 }}>
              {session.objective || `Master standard ${session.topic} principles and complete recommended study items.`}
            </p>
          </div>

          {/* Timer Circle / Counter */}
          <div
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0) 70%)',
              padding: '40px',
              borderRadius: '50%',
              display: 'inline-block',
              marginBottom: '28px',
              border: '2px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            <div style={{ fontSize: '4.2rem', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '2px', color: '#38bdf8' }}>
              {formatTime(secondsRemaining)}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
              {isActive ? '● Focus Session Running' : 'Session Paused'}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
            <button
              onClick={toggleTimer}
              style={{
                background: isActive ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#ffffff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
              }}
            >
              {isActive ? <><Pause size={18} /> Pause</> : <><Play size={18} /> {secondsRemaining === totalSeconds ? 'Start Session' : 'Resume'}</>}
            </button>

            <button
              onClick={resetTimer}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '14px 20px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>

            <button
              onClick={handleFinishSession}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              <CheckCircle size={18} /> Finish Session
            </button>
          </div>

          {/* Resources Quick Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', alignSelf: 'center' }}>Quick Access:</span>
            {session.materials && session.materials.slice(0, 4).map((mat, i) => (
              <span
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{mat.icon}</span> {mat.type}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* Session Completed Celebration Screen */
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '32px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '24px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎉</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginBottom: '8px' }}>
            SESSION COMPLETE!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '24px' }}>
            You studied <strong>{session.subjectName}</strong> ({session.topic}) for {session.durationMinutes} minutes.
          </p>

          <div
            style={{
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '16px',
              padding: '16px 24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}
          >
            <Award size={28} color="#34d399" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>+{xpAwarded} XP Earned</div>
              <div style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>Study stats & streak updated!</div>
            </div>
          </div>

          {/* Smart Session Completion Feedback */}
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '16px', borderRadius: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>How difficult was this session?</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              {['Easy', 'Okay', 'Difficult', 'Very Difficult'].map(diff => (
                <button
                  key={diff}
                  onClick={() => studyPlannerService.completeStudySession(session.id, { difficulty: diff })}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>How confident are you in this topic?</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => studyPlannerService.completeStudySession(session.id, { confidence: lvl })}
                  style={{ flex: 1, padding: '6px', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#34d399', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 800 }}
                >
                  ⭐ {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #34d399, #059669)',
                color: '#064e3b',
                fontWeight: 800,
                fontSize: '1rem',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              Return to Planner Command Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

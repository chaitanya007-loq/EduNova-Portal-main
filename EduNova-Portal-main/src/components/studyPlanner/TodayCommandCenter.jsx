import React, { useState } from 'react';
import { 
  Play, CheckCircle, Clock, Sparkles, BookOpen, Bot, HelpCircle, ArrowRight, Zap, RefreshCw, Flame, Award
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const TodayCommandCenter = ({ 
  weeklyProgress, 
  todaysFocus, 
  onStartSession, 
  onAskSage, 
  onOpenMaterials,
  onWhatShouldIStudyNow 
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [analyzingNow, setAnalyzingNow] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const completedHours = typeof weeklyProgress?.completedHours === 'number' ? weeklyProgress.completedHours : 0;
  const totalHours = typeof weeklyProgress?.totalHours === 'number' ? weeklyProgress.totalHours : 8;
  const remainingHours = Math.max(0, (totalHours - completedHours)).toFixed(1);
  const percentage = totalHours > 0 ? Math.min(100, Math.round((completedHours / totalHours) * 100)) : 0;

  const handleAnalyzeNow = () => {
    setAnalyzingNow(true);
    setTimeout(() => {
      const res = onWhatShouldIStudyNow ? onWhatShouldIStudyNow() : null;
      setAnalysisResult(res);
      setAnalyzingNow(false);
    }, 600);
  };

  return (
    <div style={{
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
      border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(56, 189, 248, 0.35)',
      borderRadius: '24px',
      padding: '24px',
      color: isLight ? '#18345F' : '#ffffff',
      backdropFilter: 'blur(20px)',
      boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : '0 20px 40px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <span style={{ fontSize: '0.74rem', background: 'rgba(16, 185, 129, 0.15)', color: isLight ? '#059669' : '#34d399', padding: '3px 10px', borderRadius: '10px', fontWeight: 800 }}>
            ● TODAY'S COMMAND CENTER
          </span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#18345F' : '#ffffff' }}>Today's Focus & Execution</h2>
        </div>
        <button
          onClick={handleAnalyzeNow}
          disabled={analyzingNow}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            color: '#fff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
          }}
        >
          {analyzingNow ? <RefreshCw className="spin" size={14} /> : <Zap size={14} />} WHAT SHOULD I STUDY NOW?
        </button>
      </div>

      {/* Progress Breakdown Bar */}
      <div style={{ background: isLight ? 'rgba(240, 246, 255, 0.75)' : 'rgba(5, 8, 20, 0.6)', border: isLight ? '1px solid rgba(200, 218, 240, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', textAlign: 'center', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: isLight ? '#52668a' : '#94a3b8', fontWeight: 700 }}>PLANNED</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#0284c7' : '#38bdf8' }}>{totalHours}h</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: isLight ? '#52668a' : '#94a3b8', fontWeight: 700 }}>COMPLETED</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#059669' : '#34d399' }}>{completedHours}h</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: isLight ? '#52668a' : '#94a3b8', fontWeight: 700 }}>REMAINING</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#d97706' : '#f59e0b' }}>{remainingHours}h</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: isLight ? '#52668a' : '#94a3b8', fontWeight: 700 }}>PROGRESS</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isLight ? '#7c3aed' : '#c084fc' }}>{percentage}%</div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div style={{ height: '8px', background: isLight ? 'rgba(218, 230, 245, 0.8)' : 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(90deg, #34d399, #38bdf8, #a855f7)', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Analysis Result Banner (if triggered) */}
      {analysisResult && (
        <div style={{ background: isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.15)', border: '1px solid #a855f7', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isLight ? '#7c3aed' : '#c084fc', fontWeight: 800, fontSize: '0.88rem', marginBottom: '6px' }}>
            <Sparkles size={16} /> NEXT BEST STUDY ACTION IDENTIFIED
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.84rem', color: isLight ? '#334155' : '#e2e8f0', lineHeight: 1.4 }}>
            {analysisResult.reason}
          </p>
          {analysisResult.session && (
            <button
              onClick={() => onStartSession(analysisResult.session)}
              style={{ padding: '8px 16px', borderRadius: '10px', background: '#a855f7', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
            >
              START NOW: {analysisResult.session.topic} ({analysisResult.session.durationMinutes}m)
            </button>
          )}
        </div>
      )}

      {/* NEXT BEST SESSION CARD */}
      {todaysFocus ? (
        <div style={{
          background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(15, 23, 42, 0.8)',
          border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '18px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: isLight ? '0 8px 25px rgba(180, 200, 230, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800, background: isLight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                NEXT UP • {todaysFocus.priority || 'High Priority'}
              </span>
              <h3 style={{ margin: '6px 0 2px 0', fontSize: '1.25rem', fontWeight: 900, color: isLight ? '#18345F' : '#ffffff' }}>{todaysFocus.topic}</h3>
              <div style={{ fontSize: '0.84rem', color: isLight ? '#52668a' : '#94a3b8' }}>{todaysFocus.subjectName} • {todaysFocus.durationMinutes || 45} minutes</div>
            </div>
            <button
              onClick={() => onStartSession(todaysFocus)}
              style={{
                padding: '12px 20px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Play size={16} fill="#fff" /> START SESSION
            </button>
          </div>

          {/* Reason Badge */}
          <div style={{ background: isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(30, 41, 59, 0.7)', padding: '10px 14px', borderRadius: '12px', borderLeft: '3px solid #06b6d4', fontSize: '0.8rem', color: isLight ? '#334155' : '#cbd5e1' }}>
            💡 <strong>Why Sage Recommended This:</strong> {todaysFocus.aiRecommendation || 'Scheduled based on your recent topic performance and target score.'}
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => onOpenMaterials(todaysFocus)} style={{ background: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)', border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.12)', color: isLight ? '#18345F' : '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={13} /> View Materials
            </button>
            <button onClick={onAskSage} style={{ background: isLight ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', color: isLight ? '#7c3aed' : '#c084fc', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bot size={13} /> Ask Sage AI
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: isLight ? '#52668a' : '#94a3b8', padding: '24px' }}>
          🎉 All study sessions completed for today! Take a rest or explore revision topics.
        </div>
      )}
    </div>
  );
};

export default TodayCommandCenter;

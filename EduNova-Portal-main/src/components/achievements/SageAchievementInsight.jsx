import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const SageAchievementInsight = () => {
  const { levelInfo = { level: 1, remainingXp: 400 } } = useLearning() || {};
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';
  const navigate = useNavigate();

  const neededXp = levelInfo?.remainingXp ?? 400;
  const currentLevel = levelInfo?.level ?? 1;

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.88) 100%)'
          : 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(99, 102, 241, 0.12))',
        backdropFilter: 'blur(20px)',
        border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid var(--accent-cyan)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.3)' : '0 0 35px rgba(6, 182, 212, 0.2)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #06b6d4, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)' }}>
          <Bot size={22} />
        </div>
        <div>
          <span className="cyber-badge-cyan" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Sage AI Achievement Insight</span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#0f172a' : 'var(--text-primary)', margin: 0 }}>
            Fastest Path to Level {currentLevel + 1}
          </h3>
        </div>
      </div>

      <p style={{ fontSize: '0.9rem', color: isLight ? '#475569' : 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '18px' }}>
        "You are currently <strong style={{ color: isLight ? '#0284c7' : '#38bdf8' }}>{neededXp} XP away</strong> from reaching Level {currentLevel + 1}. Here are 4 high-value learning actions recommended for your goals today:"
      </p>

      {/* Recommended Action Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { text: "1. Complete Planned React Lesson", xp: "+100 XP" },
          { text: "2. Complete Today's Quiz", xp: "+150 XP" },
          { text: "3. Solve 10 Practice Questions", xp: "+75 XP" },
          { text: "4. Maintain Daily Streak", xp: "+50 XP" }
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'var(--bg-secondary)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              border: isLight ? '1px solid rgba(195, 215, 245, 0.9)' : '1px solid var(--border-color)',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              boxShadow: isLight ? '0 2px 8px rgba(180, 200, 230, 0.2)' : 'none'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#0f172a' : 'var(--text-primary)' }}>{item.text}</span>
            <span className="cyber-badge-cyan" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{item.xp}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button onClick={() => navigate('/ai-assistant')}>
          Ask Sage AI <Bot size={16} />
        </Button>
        <Button variant="outline" onClick={() => navigate('/my-subjects')}>
          Start Recommended Actions <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const DailyMissionsCard = () => {
  const { dailyMissions = [], completeMission } = useLearning() || {};
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';
  const navigate = useNavigate();

  const completedCount = dailyMissions.filter((m) => m.completed).length;
  const totalMissions = dailyMissions.length || 1;
  const progressPercent = Math.min(100, Math.round((completedCount / totalMissions) * 100));

  return (
    <div
      style={{
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(240, 246, 255, 0.88) 100%)'
          : 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-xl)',
        border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid var(--border-color)',
        padding: '24px',
        boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.3)' : 'var(--glass-shadow)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="cyber-badge-cyan" style={{ fontSize: '0.78rem', marginBottom: '4px' }}>Daily Progression</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isLight ? '#0f172a' : 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={22} color="#06b6d4" /> Today's Learning Missions
          </h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.82rem', color: isLight ? '#52668a' : 'var(--text-secondary)', fontWeight: 800 }}>
            {completedCount} / {dailyMissions.length} Completed
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '8px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.08)', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #06b6d4, #10b981)', borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }} />
      </div>

      {/* Mission List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {dailyMissions.map((m) => (
          <div
            key={m.id}
            style={{
              background: m.completed ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-secondary)',
              border: m.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: m.completed ? '#10b981' : 'transparent', border: m.completed ? 'none' : '2px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                {m.completed && <CheckCircle2 size={18} />}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: m.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: m.completed ? 'line-through' : 'none' }}>
                  {m.title}
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Progress: {m.progress} / {m.target}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="cyber-badge-cyan" style={{ fontSize: '0.78rem' }}>
                <Zap size={14} /> +{m.rewardXp} XP
              </span>

              {m.completed ? (
                <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>Claimed ✓</span>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    completeMission(m.id);
                    navigate(m.actionRoute);
                  }}
                >
                  Start <ArrowRight size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

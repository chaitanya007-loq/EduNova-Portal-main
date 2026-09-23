import React from 'react';
import { Award, Zap, BookOpen, Clock, Flame, Play, Target, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { getDailyChallenge } from '../../services/labChallengeService';
import { getLabById } from '../../services/labService';
import { useTheme } from '../../context/ThemeContext';

export const LabControlCenter = ({ progress = {}, activeContext, onOpenLab, onOpenChallenge, onOpenNotebook }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const edType = activeContext?.educationType || 'college';
  const dailyChallenge = getDailyChallenge(edType);

  const completedCount = progress.completedLabs?.length || 0;
  const totalAttempts = progress.totalAttempts || 0;
  const totalXP = progress.totalXP || 0;
  const streakDays = progress.streakDays || 1;

  // Calculate average mastery
  const masteryValues = Object.values(progress.subjectMastery || {});
  const avgMastery = masteryValues.length
    ? Math.round(masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length)
    : 0;

  const lastExp = progress.lastExperiment;
  const lastLab = lastExp ? getLabById(lastExp.labId) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Stats Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}
      >
        {[
          { label: 'Labs Completed', value: completedCount, icon: CheckCircle2, color: isLight ? '#0284c7' : '#06b6d4' },
          { label: 'Total Experiments', value: totalAttempts, icon: Zap, color: isLight ? '#7c3aed' : '#a855f7' },
          { label: 'Overall Mastery', value: `${avgMastery}%`, icon: Award, color: '#10b981' },
          { label: 'Lab XP Earned', value: `${totalXP} XP`, icon: StarIcon, color: '#f59e0b' },
          { label: 'Daily Streak', value: `${streakDays} Days`, icon: Flame, color: '#ef4444' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                background: isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 23, 42, 0.65)',
                border: isLight ? '1px solid rgba(186, 230, 253, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: isLight ? '0 4px 15px rgba(37, 99, 235, 0.06)' : '0 4px 20px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  background: `${stat.color}18`,
                  color: stat.color,
                  border: `1px solid ${stat.color}35`
                }}
              >
                <Icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8', fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Banner Grid: Continue Experiment + Daily Challenge + Notebook */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Continue Experiment Card */}
        <div
          style={{
            padding: '24px',
            borderRadius: '20px',
            background: isLight
              ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(240, 246, 255, 0.9))'
              : 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(15, 23, 42, 0.7))',
            border: isLight ? '1px solid rgba(186, 230, 253, 0.8)' : '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: isLight ? '0 8px 25px rgba(37, 99, 235, 0.08)' : '0 8px 30px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Clock size={16} color={isLight ? '#0284c7' : '#38bdf8'} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isLight ? '#0284c7' : '#38bdf8', textTransform: 'uppercase' }}>
                Continue Your Experiment
              </span>
            </div>
            {lastLab ? (
              <>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: isLight ? '#0f172a' : '#ffffff', fontWeight: 700 }}>
                  {lastLab.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: isLight ? '#475569' : '#94a3b8', lineHeight: 1.4 }}>
                  {lastLab.subtitle}
                </p>
              </>
            ) : (
              <>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: isLight ? '#0f172a' : '#ffffff', fontWeight: 700 }}>
                  Ready for your first experiment?
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: isLight ? '#475569' : '#94a3b8' }}>
                  Pick any lab below or run our recommended interactive simulation.
                </p>
              </>
            )}
          </div>

          <button
            onClick={() => onOpenLab && onOpenLab(lastLab ? lastLab.id : 'projectile-motion-lab')}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'
            }}
          >
            <Play size={16} fill="#fff" /> {lastLab ? 'Resume Simulation' : 'Start Recommended Lab'}
          </button>
        </div>

        {/* Daily Challenge Card */}
        <div
          style={{
            padding: '24px',
            borderRadius: '20px',
            background: isLight
              ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(240, 246, 255, 0.9))'
              : 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(15, 23, 42, 0.7))',
            border: isLight ? '1px solid rgba(221, 214, 254, 0.8)' : '1px solid rgba(168, 85, 247, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: isLight ? '0 8px 25px rgba(124, 58, 237, 0.08)' : '0 8px 30px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: isLight ? '#7c3aed' : '#c084fc',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Target size={16} /> Daily Lab Challenge
              </span>
              <span
                style={{
                  padding: '2px 10px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: isLight ? '#d97706' : '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                +{dailyChallenge.rewardXP} XP
              </span>
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: isLight ? '#0f172a' : '#ffffff', fontWeight: 700 }}>
              {dailyChallenge.title}
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: isLight ? '#475569' : '#94a3b8', lineHeight: 1.4 }}>
              {dailyChallenge.targetObjective}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => onOpenChallenge && onOpenChallenge(dailyChallenge)}
              style={{
                flex: 1,
                padding: '10px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
              }}
            >
              <Zap size={16} /> Launch Daily Challenge
            </button>

            <button
              onClick={onOpenNotebook}
              title="Open Digital Lab Notebook"
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.8)',
                color: isLight ? '#334155' : '#cbd5e1',
                border: isLight ? '1px solid rgba(186, 230, 253, 0.6)' : '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StarIcon = (props) => (
  <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default LabControlCenter;

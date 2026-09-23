import React from 'react';
import { Target, CheckCircle2, Circle, Calendar, Trophy } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const TaskTimelineView = ({ goals = [] }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
      {goals.map(goal => {
        const completedCount = (goal.milestones || []).filter(m => m.completed).length;
        const totalCount = (goal.milestones || []).length;
        const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return (
          <div
            key={goal.id}
            style={{
              background: isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '24px',
              padding: '24px'
            }}
          >
            {/* Goal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🎯 Major Academic Goal & Timeline
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '4px 0 0 0' }}>
                  {goal.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block' }}>Target Date</span>
                  <strong style={{ fontSize: '0.95rem', color: isLight ? '#0f172a' : '#ffffff' }}>{goal.targetDate}</strong>
                </div>
                <div style={{ padding: '8px 16px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontWeight: 900, fontSize: '1.1rem' }}>
                  {pct}% Complete
                </div>
              </div>
            </div>

            {/* Timeline Milestones Horizontal Roadmap */}
            <div style={{ position: 'relative', padding: '20px 10px 10px 10px' }}>
              {/* Connecting Line */}
              <div style={{
                position: 'absolute',
                top: '36px',
                left: '40px',
                right: '40px',
                height: '4px',
                background: isLight ? 'rgba(200, 220, 240, 0.9)' : 'rgba(255, 255, 255, 0.12)',
                zIndex: 1
              }} />

              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${goal.milestones.length}, 1fr)`, gap: '16px', position: 'relative', zIndex: 2 }}>
                {goal.milestones.map((m, idx) => (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: m.completed ? '#10b981' : (isLight ? '#ffffff' : '#1e293b'),
                      border: m.completed ? 'none' : '3px solid #38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px',
                      boxShadow: m.completed ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none'
                    }}>
                      {m.completed ? <CheckCircle2 size={20} color="#ffffff" /> : <Circle size={14} color="#38bdf8" />}
                    </div>

                    <strong style={{ fontSize: '0.88rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '4px' }}>
                      {m.title}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                      {m.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default TaskTimelineView;

import React from 'react';
import { TrendingUp, CheckCircle2, AlertTriangle, Clock, Flame, BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const TaskInsightsView = ({ insights }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const cards = [
    { label: 'Completion Rate', value: `${insights.completedRate || 0}%`, icon: TrendingUp, color: '#10b981' },
    { label: 'Completed Tasks', value: insights.completedCount || 0, icon: CheckCircle2, color: '#38bdf8' },
    { label: 'Overdue Tasks', value: insights.overdueCount || 0, icon: AlertTriangle, color: '#ef4444' },
    { label: 'Current Task Streak', value: `${insights.streak || 0} Days`, icon: Flame, color: '#f59e0b' },
    { label: 'Top Active Subject', value: insights.mostActiveSubject || 'Physics', icon: BookOpen, color: '#c084fc' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '32px'
    }}>
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            style={{
              background: isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: isLight ? '1.5px solid rgba(200, 220, 240, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '24px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              background: `${c.color}22`,
              border: `1px solid ${c.color}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={22} color={c.color} />
            </div>

            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', display: 'block', lineHeight: 1 }}>
                {c.value}
              </span>
              <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                {c.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default TaskInsightsView;

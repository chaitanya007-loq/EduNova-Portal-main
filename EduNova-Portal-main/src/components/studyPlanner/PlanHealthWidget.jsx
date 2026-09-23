import React from 'react';
import { ShieldCheck, AlertTriangle, Activity, BarChart2, Zap, RefreshCw } from 'lucide-react';
import { studyPlannerService } from '../../services/studyPlannerService';
import { useTheme } from '../../context/ThemeContext';

export const PlanHealthWidget = ({ onBalancePlan }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const health = studyPlannerService.getPlanHealth();
  const balance = studyPlannerService.getSubjectBalance();

  const getStatusColor = (status) => {
    if (status === 'Healthy') return isLight ? '#059669' : '#34d399';
    if (status === 'Needs Attention') return isLight ? '#d97706' : '#f59e0b';
    return isLight ? '#dc2626' : '#f43f5e';
  };

  return (
    <div style={{
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 255, 0.90) 100%)' : 'rgba(15, 23, 42, 0.88)',
      border: isLight ? '1.5px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '24px',
      padding: '24px',
      color: isLight ? '#0f172a' : '#ffffff',
      backdropFilter: 'blur(20px)',
      boxShadow: isLight ? '0 12px 32px rgba(180, 200, 230, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color={isLight ? '#0284c7' : '#38bdf8'} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>Plan Health & Subject Balance</h3>
        </div>
        <span style={{
          fontSize: '0.76rem',
          fontWeight: 800,
          color: getStatusColor(health.status),
          background: isLight ? 'rgba(240, 246, 255, 0.9)' : 'rgba(255, 255, 255, 0.05)',
          padding: '4px 10px',
          borderRadius: '10px',
          border: `1px solid ${getStatusColor(health.status)}`
        }}>
          {health.status} ({health.score}/100)
        </span>
      </div>

      {/* Health Reasons */}
      <div style={{ background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(5, 8, 20, 0.6)', padding: '12px 14px', borderRadius: '14px', border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '16px' }}>
        {health.reasons.map((r, idx) => (
          <div key={idx} style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#cbd5e1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: getStatusColor(health.status) }}>•</span> {r}
          </div>
        ))}
      </div>

      {/* Subject Balance Breakdown */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: isLight ? '#52668a' : '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
          <span>SUBJECT ALLOCATION</span>
          <button onClick={onBalancePlan} style={{ background: 'none', border: 'none', color: isLight ? '#0284c7' : '#38bdf8', cursor: 'pointer', fontWeight: 800 }}>[Balance My Plan]</button>
        </div>

        {/* Stacked Balance Bar */}
        <div style={{ height: '10px', borderRadius: '5px', overflow: 'hidden', display: 'flex', background: isLight ? 'rgba(200, 218, 240, 0.6)' : 'rgba(255, 255, 255, 0.08)' }}>
          {Object.keys(balance).map((subj, idx) => {
            const colors = ['#38bdf8', '#a855f7', '#34d399', '#f59e0b', '#f43f5e'];
            return (
              <div
                key={subj}
                style={{
                  width: `${balance[subj]}%`,
                  background: colors[idx % colors.length],
                  height: '100%'
                }}
                title={`${subj}: ${balance[subj]}%`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
          {Object.keys(balance).map((subj, idx) => {
            const colors = ['#38bdf8', '#a855f7', '#34d399', '#f59e0b', '#f43f5e'];
            return (
              <div key={subj} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: isLight ? '#334155' : '#cbd5e1' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[idx % colors.length] }} />
                <span>{subj} ({balance[subj]}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanHealthWidget;


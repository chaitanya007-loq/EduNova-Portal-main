import React, { useState } from 'react';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const LearningTrendChart = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [metric, setMetric] = useState('mastery'); // 'mastery' | 'accuracy' | 'hours' | 'quizScore'
  const [range, setRange] = useState('30d');

  const trendData = [
    { period: 'W1', mastery: 64, accuracy: 68, hours: 8.2, quizScore: 70 },
    { period: 'W2', mastery: 69, accuracy: 72, hours: 10.5, quizScore: 74 },
    { period: 'W3', mastery: 74, accuracy: 76, hours: 14.2, quizScore: 79 },
    { period: 'W4', mastery: 82, accuracy: 79, hours: 18.6, quizScore: 83 }
  ];

  const metrics = [
    { id: 'mastery', label: 'Mastery %', color: '#6366f1' },
    { id: 'accuracy', label: 'Accuracy %', color: '#10b981' },
    { id: 'hours', label: 'Study Hours', color: isLight ? '#0284c7' : '#06b6d4' },
    { id: 'quizScore', label: 'Quiz Score', color: isLight ? '#7c3aed' : '#a855f7' }
  ];

  const activeMetricObj = metrics.find(m => m.id === metric);

  return (
    <div style={{
      padding: '20px',
      borderRadius: '24px',
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
      border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)'
    }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color={isLight ? '#0284c7' : '#06b6d4'} /> Your Learning Trend
          </h3>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>
            Historical progression and trajectory
          </span>
        </div>

        {/* Metric Selector Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {metrics.map(m => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              style={{
                padding: '5px 12px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                background: metric === m.id ? m.color : isLight ? 'rgba(235, 244, 255, 0.8)' : 'rgba(255,255,255,0.08)',
                color: metric === m.id ? '#fff' : isLight ? '#475569' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Animated Line Trend Graph */}
      <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 20px 20px 20px', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255,255,255,0.1)' }}>
        {trendData.map((d, i) => {
          const val = d[metric];
          const maxVal = metric === 'hours' ? 25 : 100;
          const heightPct = (val / maxVal) * 100;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: activeMetricObj.color }}>
                {val}{metric === 'hours' ? 'h' : '%'}
              </span>
              <div
                style={{
                  width: '40px',
                  height: `${heightPct * 1.4}px`,
                  background: `linear-gradient(180deg, ${activeMetricObj.color}, ${isLight ? 'rgba(226, 232, 240, 0.5)' : 'rgba(5,8,20,0.5)'})`,
                  borderRadius: '8px 8px 0 0',
                  boxShadow: `0 0 15px ${activeMetricObj.color}40`
                }}
              />
              <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8', fontWeight: 700 }}>{d.period}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningTrendChart;

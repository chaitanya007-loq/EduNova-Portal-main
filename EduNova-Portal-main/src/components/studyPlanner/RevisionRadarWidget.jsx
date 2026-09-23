import React, { useState } from 'react';
import { Target, AlertCircle, Clock, CheckCircle2, Award, Zap, ArrowRight } from 'lucide-react';
import { studyPlannerService } from '../../services/studyPlannerService';
import { useTheme } from '../../context/ThemeContext';

export const RevisionRadarWidget = ({ onStartRevision }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const radar = studyPlannerService.getRevisionRadarTopics();
  const [activeCategory, setActiveCategory] = useState('DUE_NOW'); // 'DUE_NOW' | 'DUE_SOON' | 'STABLE' | 'MASTERED'

  const categories = [
    { id: 'DUE_NOW', label: 'Due Now', count: radar.dueNow.length, color: isLight ? '#dc2626' : '#f43f5e' },
    { id: 'DUE_SOON', label: 'Due Soon', count: radar.dueSoon.length, color: isLight ? '#d97706' : '#f59e0b' },
    { id: 'STABLE', label: 'Stable', count: radar.stable.length, color: isLight ? '#0284c7' : '#38bdf8' },
    { id: 'MASTERED', label: 'Mastered', count: radar.mastered.length, color: isLight ? '#059669' : '#34d399' }
  ];

  const getActiveList = () => {
    if (activeCategory === 'DUE_NOW') return radar.dueNow;
    if (activeCategory === 'DUE_SOON') return radar.dueSoon;
    if (activeCategory === 'STABLE') return radar.stable;
    return radar.mastered;
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
          <Target size={18} color={isLight ? '#dc2626' : '#f43f5e'} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>Smart Revision Radar</h3>
        </div>
        <span style={{ fontSize: '0.74rem', color: isLight ? '#52668a' : '#94a3b8' }}>Adaptive Spaced Repetition</span>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: activeCategory === cat.id
                ? (isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 41, 59, 0.9)')
                : (isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(5, 8, 20, 0.5)'),
              border: activeCategory === cat.id
                ? `1.5px solid ${cat.color}`
                : (isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)'),
              color: activeCategory === cat.id ? cat.color : (isLight ? '#52668a' : '#94a3b8'),
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.color }} />
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Topic Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {getActiveList().map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '14px',
              background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(5, 8, 20, 0.6)',
              border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700 }}>{item.subject}</div>
              <div style={{ fontWeight: 800, fontSize: '0.86rem', color: isLight ? '#0f172a' : '#fff' }}>{item.topic}</div>
              <div style={{ fontSize: '0.74rem', color: isLight ? '#52668a' : '#94a3b8', marginTop: '2px' }}>Recent Accuracy: {item.accuracy}</div>
            </div>
            <button
              onClick={() => onStartRevision(item)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.76rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Revise Now <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevisionRadarWidget;

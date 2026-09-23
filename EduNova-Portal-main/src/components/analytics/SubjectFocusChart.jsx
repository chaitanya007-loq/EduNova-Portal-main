import React, { useState } from 'react';
import { PieChart, BarChart2, Grid } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SubjectFocusChart = ({ focusData }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [metricMode, setMetricMode] = useState('timeShare'); // 'timeShare' | 'progressShare'
  const [viewType, setViewType] = useState('donut'); // 'donut' | 'bar' | 'treemap'

  if (!focusData || focusData.length === 0) return null;

  return (
    <div style={{
      padding: '20px',
      borderRadius: '24px',
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
      border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color={isLight ? '#7c3aed' : '#a855f7'} /> Subject Focus Ratio
          </h3>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>
            Category distribution analysis
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Metric Toggle: Study Time vs Learning Progress */}
          <div style={{ display: 'flex', background: isLight ? 'rgba(235, 244, 255, 0.8)' : 'rgba(5, 8, 20, 0.8)', padding: '3px', borderRadius: '10px', border: isLight ? '1px solid rgba(186, 230, 253, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => setMetricMode('timeShare')}
              style={{ padding: '4px 10px', borderRadius: '8px', border: 'none', background: metricMode === 'timeShare' ? '#06b6d4' : 'transparent', color: metricMode === 'timeShare' ? '#ffffff' : isLight ? '#475569' : '#94a3b8', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Study Time %
            </button>
            <button
              onClick={() => setMetricMode('progressShare')}
              style={{ padding: '4px 10px', borderRadius: '8px', border: 'none', background: metricMode === 'progressShare' ? '#6366f1' : 'transparent', color: metricMode === 'progressShare' ? '#fff' : isLight ? '#475569' : '#94a3b8', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Progress %
            </button>
          </div>

          {/* View Type Toggle */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[{ id: 'donut', icon: PieChart }, { id: 'bar', icon: BarChart2 }, { id: 'treemap', icon: Grid }].map(vt => {
              const IconComp = vt.icon;
              return (
                <button
                  key={vt.id}
                  onClick={() => setViewType(vt.id)}
                  style={{ padding: '6px', borderRadius: '8px', border: 'none', background: viewType === vt.id ? (isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255,255,255,0.15)') : 'transparent', color: viewType === vt.id ? (isLight ? '#18345F' : '#fff') : '#64748b', cursor: 'pointer' }}
                >
                  <IconComp size={15} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render View Types */}
      {viewType === 'donut' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {focusData.map(cat => {
            const val = cat[metricMode];
            return (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: isLight ? '#1e293b' : '#e2e8f0' }}>{cat.name}</span>
                  <span style={{ color: cat.color, fontWeight: 800 }}>{val}%</span>
                </div>
                <div style={{ height: '8px', background: isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${val}%`, height: '100%', background: cat.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewType === 'bar' && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', paddingTop: '20px' }}>
          {focusData.map(cat => {
            const val = cat[metricMode];
            return (
              <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: cat.color, marginBottom: '6px' }}>{val}%</span>
                <div style={{ width: '32px', height: `${val * 1.5}px`, background: cat.color, borderRadius: '6px 6px 0 0' }} />
                <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', marginTop: '6px', textAlign: 'center' }}>{cat.name.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      )}

      {viewType === 'treemap' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8px', height: '180px' }}>
          {focusData.map(cat => {
            const val = cat[metricMode];
            return (
              <div
                key={cat.name}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: `${cat.color}25`,
                  border: `1px solid ${cat.color}50`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>{cat.name}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: cat.color }}>{val}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

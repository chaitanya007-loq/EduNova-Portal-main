import React, { useState } from 'react';
import { Zap, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const StudyHeatmap = ({ heatmapData }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [hoveredCell, setHoveredCell] = useState(null);
  const [viewMode, setViewMode] = useState('year'); // 'year' | 'month'

  if (!heatmapData || heatmapData.length === 0) return null;

  // Filter for month if needed
  const displayDays = viewMode === 'month' ? heatmapData.slice(-30) : heatmapData;

  const getColor = (count) => {
    if (count === 0) return isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255, 255, 255, 0.05)';
    if (count === 1) return 'rgba(6, 182, 212, 0.45)';
    if (count === 2) return 'rgba(99, 102, 241, 0.75)';
    return '#a855f7';
  };

  return (
    <div style={{
      padding: '20px',
      borderRadius: '24px',
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
      border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color={isLight ? '#d97706' : '#fbbf24'} /> Learning Consistency
          </h3>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>
            365-Day Activity Heatmap • 18 Day Active Streak
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['year', 'month'].map(m => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: viewMode === m ? (isLight ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.2)') : 'transparent',
                color: viewMode === m ? (isLight ? '#0284c7' : '#38bdf8') : isLight ? '#64748b' : '#94a3b8',
                border: viewMode === m ? '1px solid #06b6d4' : '1px solid transparent'
              }}
            >
              {m === 'year' ? '365 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: '8px' }}>
        {/* Hover Tooltip */}
        {hoveredCell && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '6px 12px',
              borderRadius: '10px',
              background: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(8, 12, 28, 0.98)',
              border: '1px solid #06b6d4',
              boxShadow: isLight ? '0 8px 20px rgba(37, 99, 235, 0.12)' : 'none',
              color: isLight ? '#0f172a' : '#fff',
              fontSize: '0.75rem',
              zIndex: 20
            }}
          >
            <strong>{hoveredCell.displayDate}</strong>: {hoveredCell.count} sessions ({hoveredCell.minutes} mins, {hoveredCell.topicsPracticed} topics)
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, 12px)',
            gridAutoFlow: 'column',
            gap: '3px',
            minWidth: viewMode === 'year' ? '700px' : 'auto'
          }}
        >
          {displayDays.map((d, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCell(d)}
              onMouseLeave={() => setHoveredCell(null)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: getColor(d.count),
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', marginTop: '12px' }}>
        <span>Less</span>
        <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255, 255, 255, 0.05)' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(6, 182, 212, 0.45)' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(99, 102, 241, 0.75)' }} />
        <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#a855f7' }} />
        <span>More (3+ sessions)</span>
      </div>
    </div>
  );
};

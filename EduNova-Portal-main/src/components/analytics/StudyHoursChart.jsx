import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const StudyHoursChart = ({ weeklyData }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [hoveredDay, setHoveredDay] = useState(null);

  if (!weeklyData) return null;

  const { days, thisWeekTotal, percentChange, targetHours } = weeklyData;

  const maxHours = Math.max(...days.map(d => Math.max(d.hours, d.previous, 3.5))) * 1.1;

  return (
    <div style={{
      padding: '20px',
      borderRadius: '24px',
      background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(235, 244, 255, 0.82))' : 'rgba(12, 16, 36, 0.85)',
      border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: isLight ? '0 10px 30px rgba(37, 99, 235, 0.06)' : '0 10px 30px rgba(0,0,0,0.4)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#18345F' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color={isLight ? '#0284c7' : '#06b6d4'} /> Weekly Study Hours Log
          </h3>
          <span style={{ fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>
            Compare actual study time vs targets and previous week
          </span>
        </div>

        {/* Stats Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', display: 'block' }}>This Week</span>
            <strong style={{ fontSize: '1.1rem', color: isLight ? '#0f172a' : '#fff' }}>{thisWeekTotal}h</strong>
            <span style={{ fontSize: '0.7rem', color: percentChange.startsWith('+') ? '#22c55e' : '#f43f5e', marginLeft: '6px', fontWeight: 800 }}>
              {percentChange}
            </span>
          </div>

          <div style={{ height: '24px', width: '1px', background: isLight ? 'rgba(203, 213, 225, 0.6)' : 'rgba(255,255,255,0.12)' }} />

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', display: 'block' }}>Target Line</span>
            <strong style={{ fontSize: '1.1rem', color: isLight ? '#0284c7' : '#38bdf8' }}>{targetHours}h</strong>
          </div>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div style={{ position: 'relative', height: '220px', width: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '30px', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255,255,255,0.12)' }}>
        {/* Target Line Guide */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${((targetHours / 7) / maxHours) * 190 + 30}px`,
            borderTop: '2px dashed #06b6d4',
            zIndex: 1,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: '8px'
          }}
        >
          <span style={{ fontSize: '0.65rem', color: '#06b6d4', fontWeight: 800, background: isLight ? '#ffffff' : '#050814', padding: '0 4px', borderRadius: '4px' }}>
            Daily Target ({(targetHours / 7).toFixed(1)}h)
          </span>
        </div>

        {/* Bars Grid */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', zIndex: 2 }}>
          {days.map((d) => {
            const heightPct = (d.hours / maxHours) * 100;
            const prevHeightPct = (d.previous / maxHours) * 100;
            const isHovered = hoveredDay === d.day;

            return (
              <div
                key={d.day}
                onMouseEnter={() => setHoveredDay(d.day)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                {/* Tooltip Popup */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      marginBottom: '8px',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      background: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(8, 12, 28, 0.98)',
                      border: '1px solid rgba(6, 182, 212, 0.4)',
                      boxShadow: isLight ? '0 10px 25px rgba(37, 99, 235, 0.15)' : '0 10px 25px rgba(0,0,0,0.6)',
                      fontSize: '0.75rem',
                      color: isLight ? '#0f172a' : '#fff',
                      whiteSpace: 'nowrap',
                      zIndex: 10
                    }}
                  >
                    <div style={{ fontWeight: 800, color: isLight ? '#0284c7' : '#38bdf8', marginBottom: '4px' }}>{d.day} Overview</div>
                    <div>🎯 Actual: <strong>{d.hours}h</strong> (Target: {(d.planned || 2.0)}h)</div>
                    <div>📘 Focus: {d.focus}h | 🔄 Revision: {d.revision}h</div>
                    <div>⚡ Practice: {d.practice}h</div>
                    <div style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.68rem', marginTop: '2px' }}>Prev Week: {d.previous}h</div>
                  </div>
                )}

                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isHovered ? (isLight ? '#0284c7' : '#38bdf8') : isLight ? '#334155' : '#cbd5e1', marginBottom: '6px' }}>
                  {d.hours}h
                </span>

                {/* Double Bar (This Week vs Prev Week) */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                  {/* Previous Week Bar */}
                  <div
                    style={{
                      width: '12px',
                      height: `${prevHeightPct * 1.6}px`,
                      background: isLight ? 'rgba(148, 163, 184, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px 4px 0 0'
                    }}
                    title={`Previous Week: ${d.previous}h`}
                  />

                  {/* This Week Main Bar */}
                  <div
                    style={{
                      width: '24px',
                      height: `${heightPct * 1.6}px`,
                      background: isHovered ? 'linear-gradient(180deg, #38bdf8, #6366f1)' : 'linear-gradient(180deg, #6366f1, #06b6d4)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: isHovered ? '0 0 15px rgba(6, 182, 212, 0.6)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                <span style={{ fontSize: '0.75rem', color: isLight ? '#475569' : '#94a3b8', marginTop: '8px', fontWeight: 700 }}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px', fontSize: '0.75rem', color: isLight ? '#475569' : '#94a3b8' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(180deg, #6366f1, #06b6d4)' }} /> This Week
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: isLight ? 'rgba(148, 163, 184, 0.4)' : 'rgba(255, 255, 255, 0.15)' }} /> Previous Week
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '16px', height: '2px', borderTop: '2px dashed #06b6d4' }} /> Target
        </span>
      </div>
    </div>
  );
};

export default StudyHoursChart;

import React, { useState } from 'react';
import { Network, Info } from 'lucide-react';

export const SkillConstellation = ({ skills = [], onSelectSkill }) => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Radar center and radius with generous padding margin for text labels
  const center = 160;
  const radius = 85;
  const total = Math.max(skills.length, 6);

  const getCoordinates = (index, valuePercent) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const currentRadius = (radius * (valuePercent / 100));
    const x = center + currentRadius * Math.cos(angle);
    const y = center + currentRadius * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = skills.map((s, idx) => {
    const coords = getCoordinates(idx, s.score || 50);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '380px'
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={20} color="#38bdf8" /> Skill Constellation Map
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Info size={13} /> Interactive Node View
        </span>
      </div>

      <div style={{ position: 'relative', width: '320px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="320" height="320" viewBox="0 0 320 320" style={{ overflow: 'visible' }}>
          {/* Background Grid Concentric Circles */}
          {[0.25, 0.5, 0.75, 1].map((scale, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius * scale}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeDasharray={scale === 1 ? 'none' : '4 4'}
            />
          ))}

          {/* Radial Axis Lines */}
          {skills.map((_, idx) => {
            const coords = getCoordinates(idx, 100);
            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={coords.x}
                y2={coords.y}
                stroke="rgba(255, 255, 255, 0.12)"
              />
            );
          })}

          {/* Filled Polygon Area */}
          <polygon
            points={polygonPoints}
            fill="rgba(6, 182, 212, 0.25)"
            stroke="#38bdf8"
            strokeWidth="2.5"
            style={{ filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.5))' }}
          />

          {/* Interactive Skill Nodes */}
          {skills.map((s, idx) => {
            const coords = getCoordinates(idx, s.score || 50);
            const isHovered = hoveredSkill === s.skill;

            // Smart label alignment based on quadrant position relative to center
            let textAnchor = 'middle';
            let dy = coords.y < center ? -12 : 18;
            if (coords.x > center + 30) {
              textAnchor = 'start';
              dy = 4;
            } else if (coords.x < center - 30) {
              textAnchor = 'end';
              dy = 4;
            }

            return (
              <g
                key={s.skill}
                onMouseEnter={() => setHoveredSkill(s.skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                onClick={() => onSelectSkill && onSelectSkill(s)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? 7 : 5}
                  fill={isHovered ? '#ffffff' : '#06b6d4'}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text
                  x={coords.x + (textAnchor === 'start' ? 10 : textAnchor === 'end' ? -10 : 0)}
                  y={coords.y + dy}
                  textAnchor={textAnchor}
                  fill={isHovered ? '#ffffff' : '#cbd5e1'}
                  fontSize="10"
                  fontWeight={isHovered ? '800' : '600'}
                >
                  {s.skill} ({s.score}%)
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

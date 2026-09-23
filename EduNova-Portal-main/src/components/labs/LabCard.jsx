import React, { useState } from 'react';
import { Play, Sparkles, Box, Clock, Layers, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { getSubjectTheme } from '../../services/labService';
import { useTheme } from '../../context/ThemeContext';

export const LabCard = ({ lab, isCompleted, onOpenLab }) => {
  const { theme: appTheme } = useTheme();
  const isLight = appTheme === 'light';
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const theme = getSubjectTheme(lab.subject);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '20px',
        background: isLight
          ? (hovered
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 246, 255, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 248, 255, 0.8) 100%)')
          : (hovered
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.92) 100%)'
              : 'rgba(15, 23, 42, 0.6)'),
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isLight
          ? (hovered ? '1px solid #3b82f6' : '1px solid rgba(226, 232, 240, 0.9)')
          : (hovered ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)'),
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        boxShadow: isLight
          ? (hovered
              ? '0 12px 32px rgba(37, 99, 235, 0.12)'
              : '0 4px 16px rgba(0, 0, 0, 0.03)')
          : (hovered
              ? '0 12px 32px rgba(0, 0, 0, 0.4)'
              : '0 4px 16px rgba(0, 0, 0, 0.25)')
      }}
      onClick={() => onOpenLab && onOpenLab(lab.id)}
    >
      {/* Subject Accent Line */}
      <div
        style={{
          height: '3px',
          width: '100%',
          background: `linear-gradient(90deg, ${theme.primary}, transparent)`,
          opacity: 0.85
        }}
      />

      {/* Card Content Top */}
      <div style={{ padding: '20px 20px 14px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: isLight ? '#eff6ff' : 'rgba(14, 165, 233, 0.12)',
              color: isLight ? '#1d4ed8' : '#38bdf8',
              border: isLight ? '1px solid #bfdbfe' : '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {lab.subject}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {lab.has3D && (
              <span
                title="3D Model Enabled"
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.12)',
                  color: isLight ? '#0284c7' : '#38bdf8',
                  border: isLight ? '1px solid rgba(2, 132, 199, 0.2)' : '1px solid rgba(56, 189, 248, 0.3)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Box size={12} /> 3D
              </span>
            )}
            {lab.hasAI && (
              <span
                title="Sage AI Mentor Enabled"
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: isLight ? 'rgba(124, 58, 237, 0.08)' : 'rgba(168, 85, 247, 0.12)',
                  color: isLight ? '#7c3aed' : '#c084fc',
                  border: isLight ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(168, 85, 247, 0.3)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={12} /> AI
              </span>
            )}
            {isCompleted && (
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: isLight ? 'rgba(5, 150, 105, 0.08)' : 'rgba(16, 185, 129, 0.18)',
                  color: isLight ? '#059669' : '#34d399',
                  border: isLight ? '1px solid rgba(5, 150, 105, 0.2)' : '1px solid rgba(16, 185, 129, 0.35)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCircle2 size={12} /> Mastered
              </span>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3
            style={{
              margin: '0 0 6px 0',
              fontSize: '1.08rem',
              fontWeight: 800,
              color: isLight ? '#0f172a' : '#ffffff',
              lineHeight: 1.3,
              letterSpacing: '-0.01em'
            }}
          >
            {lab.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.84rem',
              color: isLight ? '#475569' : '#94a3b8',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {lab.subtitle}
          </p>
        </div>

        {/* Skills Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {lab.skillsGained &&
            lab.skillsGained.slice(0, 2).map((skill, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  padding: '3px 9px',
                  borderRadius: '6px',
                  background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
                  color: isLight ? '#475569' : '#cbd5e1',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {skill}
              </span>
            ))}
        </div>
      </div>

      {/* Footer Info & Action */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(255, 255, 255, 0.06)',
          background: isLight ? 'rgba(248, 250, 252, 0.9)' : 'rgba(15, 23, 42, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: isLight ? '#475569' : '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> {lab.duration}
          </span>
          <span>•</span>
          <span style={{ fontWeight: 600, color: isLight ? '#0f172a' : '#e2e8f0' }}>{lab.difficulty}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenLab && onOpenLab(lab.id);
          }}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            background: btnHovered
              ? (isLight ? '#1d4ed8' : '#0284c7')
              : (isLight ? '#2563eb' : '#0ea5e9'),
            color: '#ffffff',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.82rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: btnHovered ? 'translateY(-1px)' : 'none',
            boxShadow: btnHovered
              ? (isLight ? '0 6px 16px rgba(37, 99, 235, 0.3)' : '0 6px 16px rgba(14, 165, 233, 0.4)')
              : (isLight ? '0 2px 8px rgba(37, 99, 235, 0.2)' : '0 2px 8px rgba(14, 165, 233, 0.25)')
          }}
        >
          <Play size={13} fill="#ffffff" /> Open Lab
        </button>
      </div>
    </div>
  );
};

export default LabCard;

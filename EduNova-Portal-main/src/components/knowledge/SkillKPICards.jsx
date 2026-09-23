import React, { useState } from 'react';
import { Award, Zap, Lock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SkillKPICards = ({ kpiData }) => {
  if (!kpiData) return null;

  const cards = [
    { title: 'Skills Mastered', value: kpiData.masteredCount, badge: '+3 this month', icon: Award, color: '#10b981' },
    { title: 'Skills In Progress', value: kpiData.activeCount, badge: '2 fast progress', icon: Zap, color: '#6366f1' },
    { title: 'Skills to Unlock', value: kpiData.toUnlockCount, badge: '3 prerequisites left', icon: Lock, color: '#0284c7' },
    { title: 'Learning Progress', value: `${kpiData.overallProgress}%`, badge: '+8% this month', icon: TrendingUp, color: '#06b6d4' },
    { title: 'Growing Skills', value: kpiData.growingCount, badge: 'High momentum', icon: CheckCircle, color: '#a855f7' },
    { title: 'Skills Needing Review', value: kpiData.needsReviewCount, badge: 'Action recommended', icon: AlertTriangle, color: '#f59e0b' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
      {cards.map((c, i) => {
        const IconComp = c.icon;
        return (
          <KPICard key={i} card={c} IconComp={IconComp} />
        );
      })}
    </div>
  );
};

const KPICard = ({ card, IconComp }) => {
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '16px 18px',
        borderRadius: '16px',
        background: isLight
          ? (hovered
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(230, 242, 255, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(245, 249, 255, 0.88) 100%)')
          : (hovered
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.015) 100%)'),
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: hovered
          ? `1px solid ${card.color}66`
          : (isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.09)'),
        boxShadow: hovered
          ? (isLight ? `0 12px 30px rgba(180, 200, 230, 0.45), 0 0 20px ${card.color}22` : `0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${card.color}22, inset 0 1px 0 rgba(255, 255, 255, 0.2)`)
          : (isLight ? '0 8px 24px rgba(180, 200, 230, 0.3)' : '0 8px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)'),
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Top Accent Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: card.color,
          opacity: hovered ? (isLight ? 0.25 : 0.2) : (isLight ? 0.12 : 0.08),
          filter: 'blur(25px)',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: isLight ? '#52668a' : 'rgba(226, 232, 240, 0.65)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {card.title}
        </span>
        <div
          style={{
            padding: '7px',
            borderRadius: '10px',
            background: `${card.color}15`,
            border: `1px solid ${card.color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: card.color
          }}
        >
          <IconComp size={15} color={card.color} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', lineHeight: 1, letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          {card.value}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: card.color, boxShadow: `0 0 6px ${card.color}` }} />
          <span style={{ fontSize: '0.72rem', color: card.color, fontWeight: 700 }}>
            {card.badge}
          </span>
        </div>
      </div>
    </div>
  );
};

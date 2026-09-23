import React from 'react';
import { BookOpen, Flame } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const EduNovaHeroBanner = ({
  badge = '✦ EduNova Personalization Engine',
  title = 'Good morning! 👋',
  subtitle = 'Every small step you take today brings you closer to your big dreams. Keep going!',
  stats = [
    { label: 'Level 1', subtext: '0 / 100 XP', icon: BookOpen, color: '#2dd4bf', iconBg: 'rgba(20, 184, 166, 0.25)', progress: 0 },
    { label: '0', subtext: 'Day Streak', icon: Flame, color: '#f59e0b', iconBg: 'rgba(245, 158, 11, 0.25)' },
    { label: '0', subtext: 'Learning Goals', isPill: true }
  ],
  rightGraphic = true,
  actions = null
}) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  return (
    <div style={{
      position: 'relative',
      borderRadius: '28px',
      background: isLight
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 243, 255, 0.80) 50%, rgba(240, 235, 255, 0.84) 100%)'
        : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
      padding: '28px 32px',
      boxShadow: isLight
        ? '0 20px 50px rgba(64, 100, 160, 0.10), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
        : '0 25px 60px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      gap: '24px',
      overflow: 'hidden',
      minHeight: '220px',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.25s ease'
    }}>
      {/* Radial Ambient Glows */}
      <div style={{ position: 'absolute', top: '-60px', right: '140px', width: '280px', height: '280px', borderRadius: '50%', background: isLight ? 'radial-gradient(circle, rgba(54, 199, 244, 0.25) 0%, rgba(0,0,0,0) 70%)' : 'radial-gradient(circle, rgba(34, 211, 238, 0.35) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', right: '20px', width: '260px', height: '260px', borderRadius: '50%', background: isLight ? 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(0,0,0,0) 70%)' : 'radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

      {/* Sweeping Glowing Light Curve Rays */}
      <svg width="100%" height="100%" viewBox="0 0 800 240" fill="none" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <defs>
          <linearGradient id="cyanSweep" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
            <stop offset="50%" stopColor={isLight ? "rgba(54, 199, 244, 0.45)" : "rgba(56, 189, 248, 0.65)"} />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.9)" />
          </linearGradient>
          <linearGradient id="purpleSweep" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
            <stop offset="60%" stopColor={isLight ? "rgba(168, 85, 247, 0.45)" : "rgba(168, 85, 247, 0.55)"} />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.8)" />
          </linearGradient>
        </defs>
        <path d="M 280 230 C 450 200, 620 160, 780 40" stroke="url(#cyanSweep)" strokeWidth="2.5" />
        <path d="M 340 240 C 480 220, 660 170, 800 90" stroke="url(#purpleSweep)" strokeWidth="2.5" />
      </svg>

      {/* Left Content Area */}
      <div style={{ position: 'relative', zIndex: 3, flex: '1 1 0%', minWidth: 0, maxWidth: '680px' }}>
        {badge && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '9999px',
            background: isLight ? 'rgba(79, 140, 255, 0.12)' : 'rgba(99, 102, 241, 0.18)',
            border: isLight ? '1px solid rgba(79, 140, 255, 0.35)' : '1px solid rgba(99, 102, 241, 0.35)',
            color: isLight ? '#2B70F4' : '#c084fc',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '14px',
            backdropFilter: 'blur(10px)'
          }}>
            {badge}
          </div>
        )}

        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: isLight ? '#18345F' : '#ffffff',
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em',
          fontFamily: 'var(--font-heading)'
        }}>
          {title}
        </h1>

        <p style={{ color: isLight ? '#5D7192' : '#cbd5e1', fontSize: '0.92rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>
          {subtitle}
        </p>

        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {actions}
          </div>
        )}

        {/* Stat Cards & Glass Pill Box Row */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          {stats.map((st, i) => {
            if (st.isPill) {
              return (
                <div
                  key={i}
                  style={{
                    padding: '12px 22px',
                    borderRadius: '20px',
                    background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: isLight
                      ? '0 8px 25px rgba(64, 100, 160, 0.08), inset 0 1px 1px rgba(255, 255, 255, 1)'
                      : '0 8px 25px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minWidth: '130px',
                    flexShrink: 0
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '1.6rem', fontWeight: 900, color: isLight ? '#18345F' : '#ffffff', lineHeight: 1.1 }}>
                    {st.label}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: isLight ? '#5D7192' : '#cbd5e1', fontWeight: 500, marginTop: '3px' }}>
                    {st.subtext}
                  </span>
                </div>
              );
            }

            const Icon = st.icon;
            return (
              <div
                key={i}
                style={{
                  padding: '12px 18px',
                  borderRadius: '18px',
                  background: isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.08)',
                  border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  minWidth: '140px',
                  flexShrink: 0,
                  backdropFilter: 'blur(16px)',
                  boxShadow: isLight ? '0 8px 20px rgba(64, 100, 160, 0.06)' : 'none'
                }}
              >
                {Icon && (
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: st.iconBg || (isLight ? 'rgba(79, 140, 255, 0.18)' : 'rgba(99, 102, 241, 0.25)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={st.color || (isLight ? '#4F8CFF' : '#ffffff')} />
                  </div>
                )}
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: isLight ? '#18345F' : '#ffffff' }}>{st.label}</strong>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#5D7192' : '#94a3b8' }}>{st.subtext}</span>
                  {typeof st.progress === 'number' && (
                    <div style={{ width: '85px', height: '4px', background: isLight ? 'rgba(91, 130, 190, 0.16)' : 'rgba(255, 255, 255, 0.12)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${st.progress}%`, height: '100%', background: st.color || '#36C7F4' }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side: Pixel-Perfect 3D Graduation Cap Glass Orb Graphic (Matching Reference Image 1 & 2) */}
      {rightGraphic && (
        <div style={{
          position: 'relative',
          width: '210px',
          height: '210px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          zIndex: 3
        }}>
          {/* Outer Luminous Concentric Glass Aura Rings */}
          <div style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            border: isLight ? '1.5px solid rgba(255, 255, 255, 0.85)' : '1.5px solid rgba(56, 189, 248, 0.35)',
            boxShadow: isLight ? '0 0 45px rgba(139, 92, 246, 0.25)' : '0 0 50px rgba(99, 102, 241, 0.4)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            opacity: 0.7,
            pointerEvents: 'none'
          }} />

          {/* Main Glass Orb Sphere */}
          <div style={{
            position: 'relative',
            width: '175px',
            height: '175px',
            borderRadius: '50%',
            background: isLight
              ? 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(200, 230, 255, 0.65) 30%, rgba(168, 140, 255, 0.4) 65%, rgba(99, 102, 241, 0.2) 100%)'
              : 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(56, 189, 248, 0.4) 30%, rgba(139, 92, 246, 0.3) 65%, rgba(7, 11, 24, 0.7) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            boxShadow: isLight
              ? '0 20px 55px rgba(79, 140, 255, 0.28), inset -8px -8px 30px rgba(168, 85, 247, 0.35), inset 8px 8px 30px rgba(255, 255, 255, 1)'
              : '0 25px 60px rgba(34, 211, 238, 0.4), inset -8px -8px 30px rgba(139, 92, 246, 0.5), inset 8px 8px 30px rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Curved Glass Lens Reflection Highlight */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '20px',
              width: '70px',
              height: '35px',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)',
              transform: 'rotate(-25deg)',
              pointerEvents: 'none'
            }} />

            {/* Top-Right Lens Flare Star Sparkle */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '26px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 0 14px 4px rgba(255, 255, 255, 1), 0 0 28px 8px rgba(56, 189, 248, 0.9)',
              pointerEvents: 'none'
            }} />

            {/* 3D Glass Graduation Cap SVG Centered */}
            <svg
              width="95"
              height="95"
              viewBox="0 0 100 100"
              style={{
                display: 'block',
                transform: 'translateY(-2px)',
                zIndex: 5,
                filter: isLight 
                  ? 'drop-shadow(0 10px 20px rgba(79, 140, 255, 0.4))'
                  : 'drop-shadow(0 12px 24px rgba(99, 102, 241, 0.65))'
              }}
            >
              <defs>
                <linearGradient id="capTopLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#e0f2fe" stopOpacity="0.9" />
                  <stop offset="85%" stopColor="#bae6fd" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="capBaseLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="capTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7dd3fc" />
                  <stop offset="45%" stopColor="#38bdf8" />
                  <stop offset="80%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="capBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="50%" stopColor="#312e81" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
              </defs>

              {/* Skull Cap Base */}
              <path d="M 26 52 C 26 67, 74 67, 74 52 L 74 64 C 74 76, 26 76, 26 64 Z" fill={isLight ? "url(#capBaseLightGrad)" : "url(#capBaseGrad)"} stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" />

              {/* Top Diamond Mortarboard */}
              <polygon points="50,20 92,42 50,64 8,42" fill={isLight ? "url(#capTopLightGrad)" : "url(#capTopGrad)"} stroke="rgba(255,255,255,0.95)" strokeWidth="2" />
              <polygon points="50,24 86,42 50,60 14,42" fill="rgba(255,255,255,0.4)" />

              {/* Button on top */}
              <ellipse cx="50" cy="42" rx="4" ry="2.5" fill="#ffffff" stroke="rgba(0,0,0,0.1)" />

              {/* Hanging Tassel */}
              <path d="M 50 42 Q 72 48 76 65" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="73,65 79,65 77,78 75,78" fill="#ffffff" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default EduNovaHeroBanner;

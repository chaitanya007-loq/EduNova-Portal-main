import React from 'react';
import { motion } from 'framer-motion';

export const StudyPlannerThemeGraphic = ({ isLight = false, size = 180, className = '', style = {} }) => {
  return (
    <div 
      className={`study-theme-graphic-container ${className}`}
      style={{
        position: 'absolute',
        right: '-10px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: `${size * 1.8}px`,
        height: `${size * 1.4}px`,
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'visible',
        zIndex: 1,
        opacity: isLight ? 0.85 : 1,
        ...style
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 320 240" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Glowing Neon Cyan Gradient Trail */}
          <linearGradient id="cyanTrail" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="1" />
          </linearGradient>

          {/* Glowing Neon Magenta Gradient Trail */}
          <linearGradient id="magentaTrail" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.95" />
          </linearGradient>

          {/* Orb Glass Shading */}
          <radialGradient id="orbGlassGradient" cx="32%" cy="28%" r="72%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="22%" stopColor="rgba(192, 132, 252, 0.55)" />
            <stop offset="60%" stopColor="rgba(6, 182, 212, 0.75)" />
            <stop offset="88%" stopColor="rgba(15, 23, 42, 0.90)" />
            <stop offset="100%" stopColor="rgba(11, 13, 38, 0.98)" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="orbShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#06b6d4" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Dynamic Curved Light Paths (Exact match to theme UI image) */}
        <motion.path
          d="M 5 210 C 85 190, 155 145, 315 25"
          stroke="url(#cyanTrail)"
          strokeWidth="4.5"
          strokeLinecap="round"
          filter="url(#cyanGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />

        <motion.path
          d="M 5 235 C 105 215, 185 175, 320 65"
          stroke="url(#magentaTrail)"
          strokeWidth="3.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 2.0, delay: 0.2, ease: "easeInOut" }}
        />

        {/* Ambient Backlight Aura */}
        <circle cx="140" cy="115" r="80" fill="rgba(6, 182, 212, 0.25)" filter="blur(26px)" />
        <circle cx="140" cy="115" r="65" fill="rgba(168, 85, 247, 0.28)" filter="blur(20px)" />

        {/* Outer Orbital Ring 1 */}
        <circle 
          cx="140" 
          cy="115" 
          r="72" 
          stroke={isLight ? "rgba(2, 132, 199, 0.4)" : "rgba(56, 189, 248, 0.4)"} 
          strokeWidth="1.5" 
          strokeDasharray="5 5"
        />

        {/* Outer Orbital Ring 2 (Tilted Ring) */}
        <ellipse 
          cx="140" 
          cy="115" 
          rx="78" 
          ry="74" 
          stroke={isLight ? "rgba(147, 51, 234, 0.35)" : "rgba(192, 132, 252, 0.35)"} 
          strokeWidth="1.2"
        />

        {/* Orbiting White Light Particle Node */}
        <motion.circle 
          cx="198" 
          cy="72" 
          r="5" 
          fill="#ffffff" 
          filter="drop-shadow(0 0 8px #ffffff)"
          animate={{ scale: [1, 1.35, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        />

        {/* Main 3D Glass Sphere Orb */}
        <g filter="url(#orbShadow)">
          <circle 
            cx="140" 
            cy="115" 
            r="56" 
            fill="url(#orbGlassGradient)" 
            stroke="rgba(255, 255, 255, 0.55)" 
            strokeWidth="1.8" 
          />
          
          {/* Top Glass Specular Specular Glare */}
          <path 
            d="M 103 96 A 48 48 0 0 1 177 96 A 54 54 0 0 0 103 96 Z" 
            fill="rgba(255, 255, 255, 0.7)" 
          />

          {/* Bottom Inner Glow Reflection */}
          <ellipse cx="140" cy="158" rx="34" ry="12" fill="rgba(6, 182, 212, 0.4)" filter="blur(4px)" />

          {/* Center 3D Graduation Cap Icon */}
          <g transform="translate(114, 87)">
            {/* Cap Diamond Top (Isometric View) */}
            <path 
              d="M 26 4 L 48 16 L 26 28 L 4 16 Z" 
              fill="rgba(255, 255, 255, 0.18)" 
              stroke="#38bdf8" 
              strokeWidth="2.5" 
              strokeLinejoin="round" 
              filter="drop-shadow(0 0 6px #06b6d4)"
            />
            {/* Top Inner Specular Line */}
            <path 
              d="M 26 8 L 42 16 L 26 24 L 10 16 Z" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.85)" 
              strokeWidth="1.2" 
            />
            {/* Cap Base / Skullcap Curve */}
            <path 
              d="M 12 21 V 31 C 12 36 40 36 40 31 V 21" 
              fill="rgba(14, 116, 144, 0.45)" 
              stroke="#06b6d4" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            {/* Tassel & Ribbon */}
            <path 
              d="M 40 17 Q 44 26 42 34" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            <circle cx="42" cy="34" r="2.5" fill="#38bdf8" />
          </g>
        </g>
      </svg>
    </div>
  );
};

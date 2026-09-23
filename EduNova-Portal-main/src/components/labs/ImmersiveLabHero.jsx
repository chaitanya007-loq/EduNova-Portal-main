import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Atom, Cpu, FlaskConical, Dna, Compass, Layers, ShieldCheck, Zap } from 'lucide-react';
import { getSubjectTheme } from '../../services/labService';
import { useTheme } from '../../context/ThemeContext';

const DYNAMIC_PHRASES = [
  'Explore Physics Trajectories',
  'Build Data Structure Trees',
  'Visualize Calculus Derivatives',
  'Experiment with Acid-Base Titration',
  'Design REST API Architectures',
  'Inspect 3D Cardiac Anatomy',
  'Benchmark CPU Scheduling Gantt Charts'
];

export const ImmersiveLabHero = ({ activeContext, onSwitchMode }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [phraseIndex, setPhraseIndex] = useState(0);
  const canvasRef = useRef(null);

  // Dynamic cycling text
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % DYNAMIC_PHRASES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Futuristic Canvas Particle & Orbital Mesh Background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement.clientHeight || 300);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      color: Math.random() > 0.5 ? '#06b6d4' : '#a855f7'
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.01;

      // Draw central orbital ring
      const cx = width / 2;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Glowing outer ring
      ctx.beginPath();
      ctx.ellipse(0, 0, 110, 55, Math.PI / 4, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, 90, 130, -Math.PI / 3, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Render floating particle mesh
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect nearby particles with subtle lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.18 * (1 - dist / 85)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const edType = activeContext?.educationType || 'college';

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '28px',
        background: isLight
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 243, 255, 0.80) 50%, rgba(240, 235, 255, 0.84) 100%)'
          : 'linear-gradient(135deg, rgba(30, 45, 90, 0.72) 0%, rgba(18, 25, 60, 0.82) 60%, rgba(35, 25, 80, 0.75) 100%)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: isLight
          ? '0 20px 50px rgba(64, 100, 160, 0.10), inset 0 1.5px 2px rgba(255, 255, 255, 1)'
          : '0 25px 60px rgba(0, 0, 0, 0.55), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
        padding: '32px 38px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '30px',
        alignItems: 'center',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Background Glow Spheres */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          left: '-10%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          right: '25%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Left Content */}
      <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Badges & Mode Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              color: isLight ? '#0284c7' : '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} /> AI + 3D + Interactive Simulation
          </span>

          <span
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: isLight ? '#7c3aed' : '#c084fc',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            Mode: {edType.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            color: isLight ? '#18345F' : '#ffffff',
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            background: isLight 
              ? 'linear-gradient(135deg, #18345F 30%, #0284c7 100%)' 
              : 'linear-gradient(135deg, #ffffff 30%, #a5f3fc 70%, #e9d5ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Immersive Learning Lab
        </h1>

        {/* Subtitle */}
        <p style={{ color: isLight ? '#475569' : 'rgba(226, 232, 240, 0.85)', fontSize: '1.05rem', margin: 0, lineHeight: 1.5, maxWidth: '620px' }}>
          Learn by exploring, experimenting, building and solving. <br />
          <strong style={{ color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 600 }}>Don't just study the concept. Experience it.</strong>
        </p>

        {/* Dynamic cycling topic text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '28px' }}>
          <Zap size={16} color="#a855f7" />
          <span style={{ color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>Live Focus:</span>
          <span
            key={phraseIndex}
            style={{
              color: isLight ? '#0284c7' : '#38bdf8',
              fontSize: '0.92rem',
              fontWeight: 700,
              transition: 'all 0.4s ease'
            }}
          >
            {DYNAMIC_PHRASES[phraseIndex]}
          </span>
        </div>

        {/* Dynamic Learner Mode Switcher Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
          {[
            { key: 'school', label: 'School Mode' },
            { key: 'college', label: 'College / University' },
            { key: 'exam', label: 'Exam Studio' },
            { key: 'skills', label: 'Skills & Career' }
          ].map((mode) => {
            const isActive = edType === mode.key;
            return (
              <button
                key={mode.key}
                onClick={() => onSwitchMode && onSwitchMode(mode.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: isActive ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : isLight ? 'rgba(235, 244, 255, 0.8)' : 'rgba(15, 23, 42, 0.6)',
                  color: isActive ? '#ffffff' : isLight ? '#475569' : '#94a3b8',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.6)' : isLight ? '1px solid rgba(186, 230, 253, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 16px rgba(6, 182, 212, 0.4)' : 'none'
                }}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Interactive 3D Orbit Mesh Visualizer */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          borderRadius: '18px',
          background: isLight ? 'rgba(235, 244, 255, 0.6)' : 'rgba(15, 23, 42, 0.6)',
          border: isLight ? '1px solid rgba(186, 230, 253, 0.6)' : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: isLight ? 'inset 0 0 20px rgba(37, 99, 235, 0.05)' : 'inset 0 0 30px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        {/* Center Floating Icon Badge */}
        <div
          style={{
            position: 'absolute',
            padding: '14px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(168, 85, 247, 0.25))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Atom size={34} color="#38bdf8" style={{ animation: 'spin 10s linear infinite' }} />
        </div>
      </div>
    </div>
  );
};

export default ImmersiveLabHero;

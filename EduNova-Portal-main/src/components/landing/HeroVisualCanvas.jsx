import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const HeroVisualCanvas = () => {
  const canvasRef = useRef(null);
  const scrollYRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const [isScrollingState, setIsScrollingState] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY || document.documentElement.scrollTop || 0;

    const handleScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop || 0;
      const delta = Math.abs(currentY - lastY);
      lastY = currentY;

      scrollYRef.current = currentY;
      scrollVelocityRef.current = Math.min(0.03, delta * 0.0006);
      isScrollingRef.current = true;
      setIsScrollingState(true);

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        setIsScrollingState(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let baseAngle = 0;
    let smoothScrollAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const targetScrollAngle = scrollYRef.current * 0.001;
      smoothScrollAngle += (targetScrollAngle - smoothScrollAngle) * 0.025;

      if (isScrollingRef.current) {
        baseAngle += 0.008 + scrollVelocityRef.current;
        scrollVelocityRef.current *= 0.95;
      } else {
        baseAngle += 0.003;
      }

      const angle = baseAngle + smoothScrollAngle;
      const pulseScale = isScrollingRef.current
        ? 1 + Math.sin(baseAngle * 1.8) * 0.06
        : 1 + Math.sin(baseAngle * 0.5) * 0.02;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Core sphere
      const coreRadius = 86 * pulseScale;
      const grad = ctx.createRadialGradient(cx - 15, cy - 15, 10, cx, cy, coreRadius);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.4, '#6366f1');
      grad.addColorStop(0.8, '#a855f7');
      grad.addColorStop(1, '#070b19');

      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowBlur = 35;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3D Orbital rings (spin dynamically on scroll)
      const rings = [
        { radiusX: 140 * pulseScale, radiusY: 52 * pulseScale, color: '#06b6d4', rot: angle * 1.5 },
        { radiusX: 158 * pulseScale, radiusY: 64 * pulseScale, color: '#a855f7', rot: -angle * 1.2 },
        { radiusX: 175 * pulseScale, radiusY: 74 * pulseScale, color: '#6366f1', rot: angle * 1.8 }
      ];

      rings.forEach((r) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(r.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, r.radiusX, r.radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.6;
        ctx.shadowBlur = 20;
        ctx.shadowColor = r.color;
        ctx.stroke();

        const nodeX = r.radiusX * Math.cos(angle * 2.5);
        const nodeY = r.radiusY * Math.sin(angle * 2.5);

        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 8.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.shadowBlur = 16;
        ctx.shadowColor = r.color;
        ctx.fill();

        ctx.restore();
      });

      // Sparkle particles
      for (let i = 0; i < 20; i++) {
        const pAngle = angle * 2.0 + (i * Math.PI / 10);
        const px = cx + Math.cos(pAngle) * (92 + (i * 5) % 55);
        const py = cy + Math.sin(pAngle) * (46 + (i * 4) % 40);

        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '480px',
      height: '480px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible'
    }}>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 'var(--radius-xl)'
        }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          width: '96px',
          height: '96px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isScrollingState ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.2s ease-out',
          position: 'relative'
        }}>
          <img
            src="/edunova_icon.png"
            alt="EduNova 3D Icon"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))'
            }}
          />
        </div>
        <div style={{
          marginTop: '6px',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: 900,
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }} className="gradient-text-animated">
            EduNova
          </span>
        </div>
      </div>

      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          position: 'absolute', top: '28px', left: '16px',
          background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
          padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-cyan)',
          fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-accent)', boxShadow: 'var(--glass-shadow)',
          zIndex: 10
        }}
      >
        🥽 Learn 3D/AR
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          position: 'absolute', top: '65px', right: '16px',
          background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
          padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)',
          fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-primary)', boxShadow: 'var(--glass-shadow)',
          zIndex: 10
        }}
      >
        🌐 Explore VR/AR
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          position: 'absolute', bottom: '90px', right: '16px',
          background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
          padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)',
          fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-secondary)', boxShadow: 'var(--glass-shadow)',
          zIndex: 10
        }}
      >
        🤖 AI Assistant Sage
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          position: 'absolute', bottom: '35px', left: '20px',
          background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
          padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.5)',
          fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-emerald)', boxShadow: 'var(--glass-shadow)',
          zIndex: 10
        }}
      >
        📈 Progress: 78%
      </motion.div>
    </div>
  );
};

export default HeroVisualCanvas;

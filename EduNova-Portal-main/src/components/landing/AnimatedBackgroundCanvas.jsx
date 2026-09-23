import React, { useEffect, useRef } from 'react';

export const AnimatedBackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create 70 floating spatial particles across the entire viewport
    const particleColors = ['rgba(6, 182, 212, ', 'rgba(99, 102, 241, ', 'rgba(168, 85, 247, ', 'rgba(52, 211, 153, '];
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.2 + 0.8,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      alpha: Math.random() * 0.6 + 0.25,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      pulseSpeed: Math.random() * 0.02 + 0.008
    }));

    let frame = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      frame++;

      // Render floating particles & glowing connector lines
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = Math.abs(Math.sin(frame * p.pulseSpeed)) * p.alpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw soft connector lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      {/* 1. Animated Ambient Pulsing Nebula Orbs (Distributed across the whole viewport) */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '15%',
        width: '650px',
        height: '650px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.24), rgba(99, 102, 241, 0.15) 50%, transparent 70%)',
        filter: 'blur(70px)',
        animation: 'nebulaFloat1 18s ease-in-out infinite alternate'
      }} />

      <div style={{
        position: 'absolute',
        top: '25%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.22), rgba(236, 72, 153, 0.12) 50%, transparent 70%)',
        filter: 'blur(75px)',
        animation: 'nebulaFloat2 22s ease-in-out infinite alternate'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '-5%',
        width: '650px',
        height: '650px',
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.18), rgba(6, 182, 212, 0.15) 50%, transparent 70%)',
        filter: 'blur(75px)',
        animation: 'nebulaFloat1 20s ease-in-out infinite alternate'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '25%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.14) 50%, transparent 70%)',
        filter: 'blur(70px)',
        animation: 'nebulaFloat2 16s ease-in-out infinite alternate'
      }} />

      {/* 2. Cybernetic Spatial Grid Pattern (Continuous grid across full viewport) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
        `,
        backgroundSize: '54px 54px',
        opacity: 0.4
      }} />

      {/* 3. HTML5 Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Keyframe Animations for floating background nebula orbs */}
      <style>{`
        @keyframes nebulaFloat1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.12); }
          100% { transform: translate(-40px, 60px) scale(0.95); }
        }
        @keyframes nebulaFloat2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-70px, -50px) scale(1.15); }
          100% { transform: translate(50px, -30px) scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackgroundCanvas;

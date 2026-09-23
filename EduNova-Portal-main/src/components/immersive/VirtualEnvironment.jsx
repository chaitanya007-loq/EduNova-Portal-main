import React, { useEffect, useRef } from 'react';

export const VirtualEnvironment = ({ envPreset = 'deep-space' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.01;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      if (envPreset === 'deep-space') {
        // Deep Space Radial Background
        const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, width * 0.7);
        grad.addColorStop(0, '#0c1024');
        grad.addColorStop(0.6, '#040711');
        grad.addColorStop(1, '#020307');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Ambient Nebula Clouds
        for (let i = 0; i < 30; i++) {
          const px = (cx + Math.cos(angle + i) * (200 + i * 15)) % width;
          const py = (cy + Math.sin(angle * 0.7 + i) * (150 + i * 10)) % height;
          ctx.beginPath();
          ctx.arc(px, py, (i % 4) + 1.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(168, 85, 247, 0.7)';
          ctx.fill();
        }
      } else if (envPreset === 'cyberpunk-neon') {
        ctx.fillStyle = '#090514';
        ctx.fillRect(0, 0, width, height);

        // Perspective Grid Floor Lines
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= width; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo((x - cx) * 3 + cx, height); ctx.stroke();
        }
        for (let y = cy; y <= height; y += 25) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
      } else {
        // White Laboratory
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [envPreset]);

  return (
    <canvas
      ref={canvasRef}
      width={960}
      height={540}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
};

export default VirtualEnvironment;

import React, { useState, useEffect, useRef } from 'react';
import { Activity, Sun, Dna, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export const BiologyDiagrams = () => {
  const [activeDiagram, setActiveDiagram] = useState('heart'); // 'heart', 'photosynthesis', 'replication'
  const [pulseBpm, setPulseBpm] = useState(72);
  const [isRunning, setIsRunning] = useState(true);
  const canvasRef = useRef(null);

  // Heart & Blood Circulation Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.03 * (pulseBpm / 60);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (activeDiagram === 'heart') {
        // Heart Chamber Scale Pulse
        const scale = 1 + Math.sin(time * 3) * 0.05;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        // 1. Right Atrium & Ventricle (Deoxygenated Blood - Blue)
        ctx.beginPath();
        ctx.ellipse(-40, 0, 55, 75, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.fill(); ctx.stroke();

        // 2. Left Atrium & Ventricle (Oxygenated Blood - Red)
        ctx.beginPath();
        ctx.ellipse(40, 0, 55, 75, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.fill(); ctx.stroke();

        // Aorta & Pulmonary Artery Vessels
        ctx.beginPath();
        ctx.rect(-20, -100, 16, 50);
        ctx.fillStyle = '#f43f5e'; ctx.fill();

        ctx.beginPath();
        ctx.rect(4, -100, 16, 50);
        ctx.fillStyle = '#06b6d4'; ctx.fill();

        ctx.restore();

        // Blood Flow Particles
        for (let i = 0; i < 12; i++) {
          const pTime = (time + i * 0.2) % 2;
          const pY = cy - 80 + pTime * 80;
          ctx.beginPath();
          ctx.arc(cx - 30, pY, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8'; ctx.fill();

          ctx.beginPath();
          ctx.arc(cx + 30, pY, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#fb7185'; ctx.fill();
        }

        // Labels
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Right Atrium (Deoxygenated)', cx - 110, cy - 80);
        ctx.fillText('Left Atrium (Oxygenated)', cx + 110, cy - 80);
        ctx.fillText(`CARDIAC PULSE: ${pulseBpm} BPM`, cx, cy + 140);
      }

      else if (activeDiagram === 'photosynthesis') {
        // Chloroplast Cell Membrane
        ctx.beginPath();
        ctx.ellipse(cx, cy, 180, 110, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.fill(); ctx.stroke();

        // Thylakoid Stacks (Granum)
        for (let col = -2; col <= 2; col++) {
          for (let row = -2; row <= 2; row++) {
            ctx.beginPath();
            ctx.ellipse(cx + col * 45, cy + row * 20, 18, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#059669';
            ctx.fill();
          }
        }

        // Solar Photon Rays
        for (let i = 0; i < 6; i++) {
          const pX = cx - 220 + ((time * 100 + i * 50) % 200);
          const pY = cy - 140 + ((time * 100 + i * 50) % 100);
          ctx.beginPath();
          ctx.arc(pX, pY, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24';
          ctx.shadowBlur = 10; ctx.shadowColor = '#fbbf24';
          ctx.fill(); ctx.shadowBlur = 0;
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('6CO₂ + 6H₂O + Solar Photons ➔ C₆H₁₂O₆ + 6O₂', cx, cy + 140);
      }

      else if (activeDiagram === 'replication') {
        // DNA Unzipping Fork
        for (let x = -180; x <= 180; x += 15) {
          const unzipFactor = Math.max(0, (x + 60) / 120);
          const y1 = cy - 35 * (1 + unzipFactor);
          const y2 = cy + 35 * (1 + unzipFactor);

          ctx.beginPath();
          ctx.moveTo(cx + x, y1);
          ctx.lineTo(cx + x, y2);
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath(); ctx.arc(cx + x, y1, 4, 0, Math.PI * 2); ctx.fillStyle = '#6366f1'; ctx.fill();
          ctx.beginPath(); ctx.arc(cx + x, y2, 4, 0, Math.PI * 2); ctx.fillStyle = '#a855f7'; ctx.fill();
        }

        // DNA Polymerase Enzyme Node
        ctx.beginPath();
        ctx.arc(cx - 20, cy, 25, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowBlur = 15; ctx.shadowColor = '#06b6d4';
        ctx.fill(); ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DNA Helicase & Polymerase Synthesis Fork', cx, cy + 140);
      }

      animId = requestAnimationFrame(render);
    };

    if (isRunning) {
      render();
    }

    return () => cancelAnimationFrame(animId);
  }, [activeDiagram, pulseBpm, isRunning]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Diagram Selector Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
        {[
          { id: 'heart', label: 'Human Heart Anatomy', icon: Activity },
          { id: 'photosynthesis', label: 'Photosynthesis Chloroplast', icon: Sun },
          { id: 'replication', label: 'DNA Replication Fork', icon: Dna }
        ].map((d) => {
          const Icon = d.icon;
          const isActive = activeDiagram === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDiagram(d.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-secondary)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Icon size={18} /> {d.label}
            </button>
          );
        })}
      </div>

      {/* Main Canvas Viewport */}
      <div className="canvas-container" style={{ height: '380px', borderRadius: 'var(--radius-xl)' }}>
        <canvas ref={canvasRef} width={850} height={380} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Controls */}
      {activeDiagram === 'heart' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-secondary)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Heart Rate ({pulseBpm} BPM):</label>
          <input
            type="range"
            min="40"
            max="160"
            value={pulseBpm}
            onChange={(e) => setPulseBpm(parseInt(e.target.value))}
            style={{ flex: 1 }}
          />
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Layers, ShieldCheck, Download, Move } from 'lucide-react';
import { Button } from '../common/Button';

export const ARCameraView = ({ activeObject = 'Atom Orbit Model' }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [hologramColor, setHologramColor] = useState('cyan');
  const [measureMode, setMeasureMode] = useState(false);
  const [measuredDist, setMeasuredDist] = useState('3.4 nm');

  const colors = {
    cyan: { main: '#06b6d4', glow: 'rgba(6, 182, 212, 0.8)', stroke: 'rgba(6, 182, 212, 0.4)' },
    emerald: { main: '#10b981', glow: 'rgba(16, 185, 129, 0.8)', stroke: 'rgba(16, 185, 129, 0.4)' },
    purple: { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.8)', stroke: 'rgba(168, 85, 247, 0.4)' },
    amber: { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.8)', stroke: 'rgba(245, 158, 11, 0.4)' }
  };

  const currentColor = colors[hologramColor] || colors.cyan;

  useEffect(() => {
    let streamInstance = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamInstance = stream;
          setStreamActive(true);
          setCameraError('');
        }
      } catch (err) {
        console.warn('Webcam permission error, running simulation mode:', err);
        setCameraError('Webcam permission not granted. Running AR Hologram Simulation Mode.');
      }
    };

    startCamera();

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Multi-Domain Subject Canvas Renderer Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let angle = 0;

    const renderOverlay = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.025;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Surface Target Scanning Ring
      ctx.strokeStyle = currentColor.stroke;
      ctx.lineWidth = 1;
      for (let r = 40; r < 200; r += 35) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 160, angle, angle + Math.PI / 2);
      ctx.strokeStyle = currentColor.main;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);

      // --- DYNAMIC GEOMETRY RENDERERS BASED ON ACTIVE MODEL ---

      // 1. DNA DOUBLE HELIX
      if (activeObject === 'DNA Double Helix') {
        const points = 16;
        for (let i = -points; i <= points; i++) {
          const y = i * 10;
          const x1 = Math.sin(angle + i * 0.3) * 60;
          const x2 = Math.sin(angle + i * 0.3 + Math.PI) * 60;

          // Base pair connecting bar
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = currentColor.stroke;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Strand 1 Node
          ctx.beginPath();
          ctx.arc(x1, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = currentColor.main;
          ctx.fill();

          // Strand 2 Node
          ctx.beginPath();
          ctx.arc(x2, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
        }
      }

      // 2. BLACK HOLE SINGULARITY
      else if (activeObject === 'Black Hole Singularity') {
        // Accretion Swirl Particles
        for (let i = 0; i < 40; i++) {
          const pAngle = angle * 2 + i * 0.2;
          const dist = 50 + (i * 3) % 90;
          const px = Math.cos(pAngle) * dist;
          const py = Math.sin(pAngle) * (dist * 0.4);

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#f59e0b';
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Event Horizon Dark Core Void
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.fillStyle = '#020408';
        ctx.fill();
        ctx.strokeStyle = currentColor.main;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 25;
        ctx.shadowColor = currentColor.main;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 3. NEURAL SYNAPSE NETWORK
      else if (activeObject === 'Neural Synapse Network') {
        // Presynaptic Terminal
        ctx.beginPath();
        ctx.arc(-70, 0, 35, -Math.PI / 2, Math.PI / 2);
        ctx.strokeStyle = currentColor.main;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Postsynaptic Terminal
        ctx.beginPath();
        ctx.arc(70, 0, 35, Math.PI / 2, -Math.PI / 2);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Synaptic Neurotransmitter Particles
        for (let i = 0; i < 8; i++) {
          const px = -40 + ((angle * 50 + i * 20) % 80);
          const py = (Math.sin(angle * 3 + i) * 15);
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#34d399';
          ctx.fill();
        }
      }

      // 4. GREAT PYRAMID OF GIZA
      else if (activeObject === 'Great Pyramid of Giza') {
        // 3D Wireframe Pyramid
        const top = { x: 0, y: -90 };
        const b1 = { x: -80, y: 50 };
        const b2 = { x: 0, y: 80 };
        const b3 = { x: 80, y: 50 };
        const b4 = { x: 0, y: 20 };

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;

        // Base
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(b3.x, b3.y); ctx.lineTo(b4.x, b4.y);
        ctx.closePath(); ctx.stroke();

        // Apex Lines
        ctx.beginPath();
        ctx.moveTo(top.x, top.y); ctx.lineTo(b1.x, b1.y);
        ctx.moveTo(top.x, top.y); ctx.lineTo(b2.x, b2.y);
        ctx.moveTo(top.x, top.y); ctx.lineTo(b3.x, b3.y);
        ctx.moveTo(top.x, top.y); ctx.lineTo(b4.x, b4.y);
        ctx.stroke();

        // Apex Gold Light Beacon Ray
        ctx.beginPath();
        ctx.arc(top.x, top.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowBlur = 20; ctx.shadowColor = '#fbbf24';
        ctx.fill(); ctx.shadowBlur = 0;
      }

      // 5. CYBERNETIC TURBINE ENGINE
      else if (activeObject === 'Cybernetic Turbine Engine') {
        // Multi-stage Turbine Blades
        const blades = 10;
        for (let i = 0; i < blades; i++) {
          const bAngle = angle * 3 + (i * (Math.PI * 2 / blades));
          ctx.save();
          ctx.rotate(bAngle);
          ctx.beginPath();
          ctx.rect(0, -6, 85, 12);
          ctx.fillStyle = currentColor.stroke;
          ctx.strokeStyle = currentColor.main;
          ctx.lineWidth = 1.5;
          ctx.fill(); ctx.stroke();
          ctx.restore();
        }

        // Rotor Core
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.fillStyle = currentColor.main;
        ctx.shadowBlur = 20; ctx.shadowColor = currentColor.main;
        ctx.fill(); ctx.shadowBlur = 0;
      }

      // 6. DEFAULT ATOM ORBIT MODEL & OTHERS
      else {
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, 115, 45, angle, 0, Math.PI * 2);
        ctx.strokeStyle = currentColor.glow;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(115 * Math.cos(angle * 2.5), 45 * Math.sin(angle * 2.5), 9, 0, Math.PI * 2);
        ctx.fillStyle = currentColor.main;
        ctx.shadowBlur = 20; ctx.shadowColor = currentColor.main;
        ctx.fill();

        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 115, 45, -angle, 0, Math.PI * 2);
        ctx.strokeStyle = currentColor.stroke;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.fillStyle = currentColor.main;
        ctx.shadowBlur = 30; ctx.shadowColor = currentColor.main;
        ctx.fill(); ctx.shadowBlur = 0;
      }

      ctx.restore();

      // Measurement Vector (if active)
      if (measureMode) {
        ctx.beginPath();
        ctx.moveTo(cx - 100, cy - 80);
        ctx.lineTo(cx + 100, cy + 80);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillText(`VECTOR MEASURE: ${measuredDist}`, cx, cy - 95);
      }

      // Telemetry Label Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`AR HOLOGRAPHIC TARGET: ${activeObject.toUpperCase()}`, cx, cy + 195);

      animId = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();

    return () => cancelAnimationFrame(animId);
  }, [activeObject, hologramColor, measureMode, measuredDist]);

  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `EduNova_${activeObject.replace(/\s+/g, '_')}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Live AR Camera Viewport */}
      <div style={{
        height: '490px',
        background: '#040711',
        borderRadius: 'var(--radius-xl)',
        border: `2px solid ${currentColor.main}`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 45px ${currentColor.glow}`
      }}>
        {/* Video Camera Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: streamActive ? 'block' : 'none',
            zIndex: 1
          }}
        />

        {/* Camera Fallback Graphic */}
        {!streamActive && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.25), #040711 80%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}>
            <Camera size={52} color={currentColor.main} className="animate-pulse-glow" />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '14px', maxWidth: '420px' }}>
              {cameraError || 'Activating WebCam Feed & Target Scanning Grid...'}
            </p>
          </div>
        )}

        {/* Spatial Overlay Canvas */}
        <canvas
          ref={canvasRef}
          width={880}
          height={490}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        />

        {/* AR Telemetry HUD Header */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-color)',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          zIndex: 30
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700 }}>
              <ShieldCheck size={14} /> SURFACE LOCKED
            </span>
            <span>FPS: <strong style={{ color: currentColor.main }}>60</strong></span>
            <span>Target: <strong style={{ color: '#a855f7' }}>{activeObject}</strong></span>
          </div>

          <button
            onClick={() => setMeasureMode(!measureMode)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: measureMode ? 'rgba(244, 63, 94, 0.25)' : 'var(--bg-tertiary)',
              color: measureMode ? '#fb7185' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Move size={12} /> {measureMode ? 'Ruler Active' : 'Measure Vector'}
          </button>
        </div>

        {/* Hologram Palette Selector Footer */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          zIndex: 30
        }}>
          {['cyan', 'emerald', 'purple', 'amber'].map((c) => (
            <button
              key={c}
              onClick={() => setHologramColor(c)}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: colors[c].main,
                border: hologramColor === c ? '2px solid #ffffff' : 'none',
                cursor: 'pointer'
              }}
              title={`${c} hologram theme`}
            />
          ))}
        </div>
      </div>

      <Button onClick={handleCaptureSnapshot}>
        <Download size={16} /> Capture AR Hologram Snapshot
      </Button>
    </div>
  );
};

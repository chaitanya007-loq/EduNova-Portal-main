import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Eye, Layers, RefreshCw, Box, Sparkles, Activity } from 'lucide-react';

export const Lab3DViewer = ({ modelType = 'heart', title = '3D Model Explorer' }) => {
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [explodeLevel, setExplodeLevel] = useState(0);
  const [isXRay, setIsXRay] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let angleX = 0;
    let angleY = 0;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 350);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angleY += 0.015 * rotationSpeed;
      angleX += 0.005 * rotationSpeed;

      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      // Model-specific 3D Canvas Geometry Rendering
      if (modelType === 'heart' || modelType === 'biology_3d_heart') {
        // Render 3D Cardiac Vessel Geometry
        const expand = explodeLevel * 15;

        // Left Ventricle Chamber
        ctx.beginPath();
        ctx.arc(-20 - expand, 10, 45, 0, Math.PI * 2);
        ctx.fillStyle = isXRay ? 'rgba(239, 68, 68, 0.3)' : 'rgba(225, 29, 72, 0.85)';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Right Atrium Chamber
        ctx.beginPath();
        ctx.arc(30 + expand, -20 - expand, 35, 0, Math.PI * 2);
        ctx.fillStyle = isXRay ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.85)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Aorta Arch Line
        ctx.beginPath();
        ctx.moveTo(-10, -45 - expand);
        ctx.quadraticCurveTo(0, -90 - expand, 30, -50 - expand);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 14;
        ctx.stroke();

        // Labels Overlay
        if (showLabels) {
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('Aorta Arch', 35, -70 - expand);
          ctx.fillText('L. Ventricle', -65 - expand, 45);
          ctx.fillText('R. Atrium', 45 + expand, -35);
        }
      } else if (modelType === 'atom' || modelType === 'chemistry_titration') {
        // Atomic Electron Orbital Geometry
        const radius = 60 + explodeLevel * 12;

        // Nucleus
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fillStyle = isXRay ? 'rgba(168, 85, 247, 0.4)' : '#a855f7';
        ctx.fill();

        // Orbit 1
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 0.4, angleY, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Orbit 2
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.4, radius, -angleY, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Electrons
        const ex1 = Math.cos(angleY * 2) * radius;
        const ey1 = Math.sin(angleY * 2) * radius * 0.4;
        ctx.beginPath();
        ctx.arc(ex1, ey1, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
      } else {
        // Reusable 3D Tech Cube Mesh
        const s = 50 + explodeLevel * 10;
        ctx.rotate(angleY);
        ctx.strokeStyle = isXRay ? 'rgba(56, 189, 248, 0.4)' : '#06b6d4';
        ctx.lineWidth = 2;
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.strokeRect(-s / 3, -s / 3, s, s);
      }

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [modelType, rotationSpeed, explodeLevel, isXRay, showLabels]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '340px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(8, 13, 36, 0.95))',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Top Controls Overlay */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 5
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Box size={16} color="#38bdf8" /> {title}
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsXRay(!isXRay)}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: isXRay ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.6)',
              color: isXRay ? '#38bdf8' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            X-Ray
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: showLabels ? 'rgba(168, 85, 247, 0.25)' : 'rgba(30, 41, 59, 0.6)',
              color: showLabels ? '#c084fc' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Labels
          </button>

          <button
            onClick={() => setExplodeLevel((prev) => (prev > 0 ? 0 : 1))}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              background: explodeLevel > 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(30, 41, 59, 0.6)',
              color: explodeLevel > 0 ? '#34d399' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Explode View
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div style={{ flex: 1, position: 'relative' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      {/* Bottom Controls Bar */}
      <div
        style={{
          padding: '10px 16px',
          background: 'rgba(15, 23, 42, 0.7)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#94a3b8'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Rotation:</span>
          <button
            onClick={() => setRotationSpeed((s) => (s === 1 ? 0 : 1))}
            style={{
              background: 'none',
              border: 'none',
              color: rotationSpeed > 0 ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {rotationSpeed > 0 ? 'Pause' : 'Rotate'}
          </button>
        </div>

        <span>Drag mouse to inspect 360° geometry</span>
      </div>
    </div>
  );
};

export default Lab3DViewer;

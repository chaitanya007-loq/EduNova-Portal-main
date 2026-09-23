import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Play, Pause, FastForward, Eye, Layers, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const XR3DViewer = ({ experience, onSelectHotspot, onAskSage }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 15, y: 35 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [xrayMode, setXrayMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [simPlaying, setSimPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simTime, setSimTime] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState(null);

  // Animation Loop
  useEffect(() => {
    let animId;
    let timeAcc = 0;

    const render = () => {
      if (simPlaying) {
        timeAcc += 0.016 * simSpeed;
        setSimTime(Number(timeAcc.toFixed(2)));
      }

      if (autoRotate && !isDragging) {
        setRotation(prev => ({ ...prev, y: (prev.y + 0.35 * simSpeed) % 360 }));
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate, isDragging, simPlaying, simSpeed]);

  const handleMouseDown = e => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = e => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation(prev => ({
      x: Math.max(-80, Math.min(80, prev.x - dy * 0.4)),
      y: (prev.y + dx * 0.4) % 360
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = e => {
    e.preventDefault();
    setZoom(prev => Math.max(0.6, Math.min(2.5, prev - e.deltaY * 0.0015)));
  };

  const resetView = () => {
    setRotation({ x: 15, y: 35 });
    setZoom(1);
    setExploded(false);
    setXrayMode(false);
  };

  const handleHotspotClick = hotspot => {
    setActiveHotspotId(hotspot.id);
    if (onSelectHotspot) onSelectHotspot(hotspot);
  };

  // HIGH-FIDELITY 3D CANVAS RENDERER FOR EVERY COLLEGE & SCHOOL MODEL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateDimensions = () => {
      if (canvas.parentElement) {
        const newW = canvas.parentElement.clientWidth || 600;
        const newH = canvas.parentElement.clientHeight || 450;
        if (canvas.width !== newW || canvas.height !== newH) {
          canvas.width = newW;
          canvas.height = newH;
        }
      }
    };
    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const width = canvas.width || 600;
    const height = canvas.height || 450;

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(zoom, zoom);

    const modelId = experience?.id || 'human-heart';
    const explodeDist = exploded ? 40 : 0;

    if (modelId.includes('cpu') || modelId.includes('pipeline')) {
      // 1. RISC CPU SUPERSCALAR PIPELINE 3D GRAPHIC
      ctx.shadowColor = xrayMode ? '#38bdf8' : '#6366f1';
      ctx.shadowBlur = xrayMode ? 25 : 12;

      // Pipeline Stage Container Boxes
      const stages = ['IF (Fetch)', 'ID (Decode)', 'EX (Execute)', 'MEM (Access)', 'WB (Write)'];
      const stageW = 85;
      const startX = -((stages.length * (stageW + 12)) / 2);

      stages.forEach((st, idx) => {
        const x = startX + idx * (stageW + 12) + (idx >= 2 ? explodeDist : 0);
        const y = -25;

        // Stage Box
        ctx.fillStyle = idx === 2 ? 'rgba(99, 102, 241, 0.45)' : 'rgba(30, 41, 59, 0.85)';
        ctx.fillRect(x, y, stageW, 60);
        ctx.strokeStyle = idx === 2 ? '#38bdf8' : 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, stageW, 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(st, x + 8, y + 35);
      });

      // Dedicated ALU Core Block
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-stageW / 2 + explodeDist, 60, stageW, 45);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-stageW / 2 + explodeDist, 60, stageW, 45);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('ALU Core', -stageW / 2 + explodeDist + 15, 87);

      // L1 SRAM Data Cache Grid
      ctx.fillStyle = '#10b981';
      ctx.fillRect(stageW * 1.2 + explodeDist, 60, 90, 45);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(stageW * 1.2 + explodeDist, 60, 90, 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('L1 Data Cache', stageW * 1.2 + explodeDist + 8, 87);

      // Moving Instruction Packet
      const packetX = startX + ((simTime * 90) % (stages.length * 97));
      ctx.beginPath();
      ctx.arc(packetX, 5, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

    } else if (modelId.includes('dbms') || modelId.includes('btree')) {
      // 2. DATABASE RELATIONAL B-TREE INDEX ARCHITECTURE
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 15;

      // Root Index Page
      ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
      ctx.fillRect(-60, -100, 120, 36);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-60, -100, 120, 36);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('Root Page [10 | 50 | 90]', -52, -78);

      // Pointer Branches
      ctx.beginPath();
      ctx.moveTo(0, -64); ctx.lineTo(-110 - explodeDist, -20);
      ctx.moveTo(0, -64); ctx.lineTo(0, -20);
      ctx.moveTo(0, -64); ctx.lineTo(110 + explodeDist, -20);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Leaf Data Pages (Doubly Linked)
      const leafX = [-140 - explodeDist, -45, 50, 145 + explodeDist];
      leafX.forEach((lx, i) => {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.fillRect(lx - 35, -20, 70, 40);
        ctx.strokeStyle = '#10b981';
        ctx.strokeRect(lx - 35, -20, 70, 40);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillText(`Page ${i + 1}`, lx - 20, 4);
      });

      // Sequential Scan Chain Line
      ctx.beginPath();
      ctx.moveTo(-140 - explodeDist + 35, 0);
      ctx.lineTo(145 + explodeDist - 35, 0);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

    } else if (modelId.includes('tree')) {
      // 3. 3D BINARY SEARCH TREE & AVL GRAPH
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 15;

      const nodes = [
        { val: 50, x: 0, y: -90, color: '#3b82f6' },
        { val: 25, x: -90 - explodeDist, y: -20, color: '#06b6d4' },
        { val: 75, x: 90 + explodeDist, y: -20, color: '#a855f7' },
        { val: 12, x: -140 - explodeDist, y: 50, color: '#10b981' },
        { val: 37, x: -45 - explodeDist, y: 50, color: '#10b981' },
        { val: 62, x: 45 + explodeDist, y: 50, color: '#f59e0b' },
        { val: 87, x: 140 + explodeDist, y: 50, color: '#f59e0b' }
      ];

      // Draw Edges
      ctx.beginPath();
      ctx.moveTo(0, -90); ctx.lineTo(-90 - explodeDist, -20);
      ctx.moveTo(0, -90); ctx.lineTo(90 + explodeDist, -20);
      ctx.moveTo(-90 - explodeDist, -20); ctx.lineTo(-140 - explodeDist, 50);
      ctx.moveTo(-90 - explodeDist, -20); ctx.lineTo(-45 - explodeDist, 50);
      ctx.moveTo(90 + explodeDist, -20); ctx.lineTo(45 + explodeDist, 50);
      ctx.moveTo(90 + explodeDist, -20); ctx.lineTo(140 + explodeDist, 50);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Render Node Spheres
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(n.val.toString(), n.x - 7, n.y + 4);
      });

    } else if (modelId.includes('microservices') || modelId.includes('system') || modelId.includes('api')) {
      // 4. MICROSERVICES & API GATEWAY CLOUD ARCHITECTURE
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 15;

      // Ingress Load Balancer
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.fillRect(-160 - explodeDist, -40, 70, 80);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(-160 - explodeDist, -40, 70, 80);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('NGINX LB', -152 - explodeDist, 5);

      // API Gateway
      ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.fillRect(-50, -40, 70, 80);
      ctx.strokeStyle = '#6366f1';
      ctx.strokeRect(-50, -40, 70, 80);

      ctx.fillStyle = '#ffffff';
      ctx.fillText('API Gateway', -46, 5);

      // Redis & Microservices
      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.fillRect(70 + explodeDist, -70, 80, 50);
      ctx.fillRect(70 + explodeDist, 20, 80, 50);
      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(70 + explodeDist, -70, 80, 50);
      ctx.strokeRect(70 + explodeDist, 20, 80, 50);

      ctx.fillStyle = '#ffffff';
      ctx.fillText('Redis Cache', 76 + explodeDist, -40);
      ctx.fillText('Auth Service', 76 + explodeDist, 50);

      // Connecting Traffic Lines
      ctx.beginPath();
      ctx.moveTo(-90 - explodeDist, 0); ctx.lineTo(-50, 0);
      ctx.moveTo(20, 0); ctx.lineTo(70 + explodeDist, -45);
      ctx.moveTo(20, 0); ctx.lineTo(70 + explodeDist, 45);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

    } else if (modelId.includes('heart')) {
      // 5. HUMAN HEART ANATOMY
      ctx.shadowColor = xrayMode ? '#38bdf8' : '#f43f5e';
      ctx.shadowBlur = xrayMode ? 25 : 15;

      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.fillStyle = xrayMode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(225, 29, 72, 0.85)';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(-explodeDist, -65 - explodeDist, 30, Math.PI, 0);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 14;
      ctx.stroke();

      const pulseR = 75 + Math.sin(simTime * 5) * 6;
      ctx.beginPath();
      ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

    } else {
      // 6. GENERIC HOLOGRAM SPHERE
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.fillStyle = xrayMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(59, 130, 246, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();

    return () => {
      resizeObserver.disconnect();
    };
  }, [rotation, zoom, exploded, xrayMode, simTime, experience]);

  const activeHotspot = experience?.hotspots?.find(h => h.id === activeHotspotId);

  const [isExpanded, setIsExpanded] = useState(false);

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: isLight ? '#0f172a' : '#ffffff',
    fontSize: '0.76rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 6px',
    borderRadius: '6px'
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isExpanded ? '820px' : '680px',
        background: isLight
          ? 'radial-gradient(circle at center, #0f172a 0%, #050814 100%)'
          : 'radial-gradient(circle at center, #0f172a 0%, #050814 100%)',
        borderRadius: '20px',
        border: isLight ? '1.5px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(56, 189, 248, 0.35)',
        overflow: 'hidden',
        boxShadow: isLight ? '0 15px 45px rgba(100, 130, 200, 0.2)' : '0 20px 50px rgba(0, 0, 0, 0.6)',
        transition: 'height 0.3s ease'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab' }} />

      {showLabels && experience?.hotspots?.map(h => (
        <button
          key={h.id}
          onClick={() => handleHotspotClick(h)}
          style={{
            position: 'absolute',
            left: `${h.x}%`,
            top: `${h.y}%`,
            transform: 'translate(-50%, -50%)',
            background: activeHotspotId === h.id
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : (isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(15, 23, 42, 0.85)'),
            color: activeHotspotId === h.id ? '#ffffff' : (isLight ? '#0f172a' : '#ffffff'),
            border: activeHotspotId === h.id
              ? '2px solid #ffffff'
              : (isLight ? '1.5px solid #0284c7' : '1px solid #38bdf8'),
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: isLight ? '0 4px 15px rgba(0, 0, 0, 0.15)' : '0 4px 15px rgba(0, 0, 0, 0.5)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
          <span>{h.name}</span>
        </button>
      ))}

      {/* Floating Toolbar Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(15, 23, 42, 0.85)',
          padding: '6px 14px',
          borderRadius: '30px',
          border: isLight ? '1px solid rgba(199, 210, 254, 0.9)' : '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          zIndex: 20,
          boxShadow: isLight ? '0 8px 25px rgba(0, 0, 0, 0.12)' : 'none'
        }}
      >
        <button onClick={() => setSimPlaying(!simPlaying)} style={buttonStyle}>
          {simPlaying ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <button onClick={() => setSimSpeed(s => (s === 1 ? 2 : s === 2 ? 0.5 : 1))} style={buttonStyle}>
          <FastForward size={15} /> {simSpeed}x
        </button>
        <div style={{ width: '1px', height: '18px', background: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)' }} />
        <button onClick={() => setAutoRotate(!autoRotate)} style={{ ...buttonStyle, color: autoRotate ? (isLight ? '#0284c7' : '#38bdf8') : (isLight ? '#64748b' : '#94a3b8') }}>
          <RotateCw size={15} /> Auto
        </button>
        <button onClick={() => setExploded(!exploded)} style={{ ...buttonStyle, color: exploded ? '#d97706' : (isLight ? '#64748b' : '#94a3b8') }}>
          <Layers size={15} /> Explode
        </button>
        <button onClick={() => setXrayMode(!xrayMode)} style={{ ...buttonStyle, color: xrayMode ? '#7c3aed' : (isLight ? '#64748b' : '#94a3b8') }}>
          <Eye size={15} /> X-Ray
        </button>
        <button onClick={() => setShowLabels(!showLabels)} style={{ ...buttonStyle, color: showLabels ? '#059669' : (isLight ? '#64748b' : '#94a3b8') }}>
          Labels
        </button>
        <button onClick={resetView} style={buttonStyle}>
          Reset
        </button>
      </div>

      {activeHotspot && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            maxWidth: '280px',
            background: isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(15, 23, 42, 0.92)',
            border: isLight ? '1.5px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '16px',
            padding: '14px',
            backdropFilter: 'blur(16px)',
            color: isLight ? '#0f172a' : '#fff',
            zIndex: 25,
            boxShadow: isLight ? '0 12px 30px rgba(100, 130, 200, 0.2)' : '0 12px 30px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h4 style={{ margin: 0, color: isLight ? '#0284c7' : '#38bdf8', fontSize: '0.92rem', fontWeight: 800 }}>{activeHotspot.name}</h4>
            <button onClick={() => setActiveHotspotId(null)} style={{ background: 'none', border: 'none', color: isLight ? '#64748b' : '#94a3b8', cursor: 'pointer', fontWeight: 800 }}>✕</button>
          </div>
          <p style={{ fontSize: '0.8rem', color: isLight ? '#334155' : '#cbd5e1', margin: '0 0 8px 0', lineHeight: 1.35 }}>{activeHotspot.description}</p>
          {onAskSage && (
            <button
              onClick={() => onAskSage(`Explain the role of ${activeHotspot.name} in ${experience?.name}`)}
              style={{
                width: '100%',
                padding: '6px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.76rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '6px'
              }}
            >
              <Zap size={13} /> Ask Sage AI About This
            </button>
          )}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(5, 8, 20, 0.75)',
          border: isLight ? '1px solid rgba(200, 218, 240, 0.9)' : '1px solid rgba(56, 189, 248, 0.25)',
          padding: '8px 12px',
          borderRadius: '10px',
          fontSize: '0.75rem',
          color: isLight ? '#475569' : '#94a3b8',
          zIndex: 15,
          fontWeight: 600
        }}
      >
        <div style={{ color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 800, marginBottom: '2px' }}>Live XR Telemetry</div>
        <div>Time: {simTime}s</div>
        <div>Rot: X:{Math.round(rotation.x)}° Y:{Math.round(rotation.y)}°</div>
        <div>Zoom: {zoom.toFixed(2)}x</div>
      </div>
    </div>
  );
};

export default XR3DViewer;

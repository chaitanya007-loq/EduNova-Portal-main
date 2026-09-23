import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { Button } from '../common/Button';

export const GravitySimulator = () => {
  const canvasRef = useRef(null);
  const [gravity, setGravity] = useState(9.8);
  const [mass, setMass] = useState(50);
  const [velocity, setVelocity] = useState(45);
  const [launchAngle, setLaunchAngle] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({ maxHeight: 0, distance: 0, time: 0 });

  const stateRef = useRef({ gravity, mass, velocity, launchAngle, isRunning });
  stateRef.current = { gravity, mass, velocity, launchAngle, isRunning };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;

    let posX = 80;
    let posY = canvas.height - 60;
    let time = 0;
    let path = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.01;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // 1. Draw Background Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // 2. Draw 3D Holographic Earth Globe Sphere at Center (Matching Mockup)
      const globeRadius = 110;

      // Outer Gravitational Field Rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, globeRadius + 30, 0, Math.PI * 2); ctx.stroke();

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)';
      ctx.beginPath(); ctx.arc(cx, cy, globeRadius + 60, 0, Math.PI * 2); ctx.stroke();

      // Earth Globe Body
      const earthGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, globeRadius);
      earthGrad.addColorStop(0, '#38bdf8');
      earthGrad.addColorStop(0.5, '#0284c7');
      earthGrad.addColorStop(1, '#07122a');

      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = earthGrad;
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#06b6d4';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Earth Continent Wireframe Lines
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, globeRadius, globeRadius * 0.4, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, globeRadius * 0.4, globeRadius, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // 3. Draw Rocket Trajectory Line
      ctx.beginPath();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      path.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // 4. Physics Step Calculation
      if (stateRef.current.isRunning && posY <= canvas.height - 40) {
        time += 0.08;
        const currentGravity = stateRef.current.gravity;
        const currentVelocity = stateRef.current.velocity;
        const currentAngle = (stateRef.current.launchAngle * Math.PI) / 180;

        const currentVx = currentVelocity * Math.cos(currentAngle);
        const currentVy = currentVelocity * Math.sin(currentAngle);

        posX = 80 + currentVx * time * 6;
        posY = (canvas.height - 60) - (currentVy * time * 6 - 0.5 * currentGravity * Math.pow(time, 2) * 6);

        path.push({ x: posX, y: posY });

        const currentMaxHeight = Math.max(0, ((canvas.height - 60) - Math.min(...path.map(p => p.y))) / 6);
        const currentDist = (posX - 80) / 6;

        setStats({
          maxHeight: currentMaxHeight.toFixed(1),
          distance: currentDist.toFixed(1),
          time: time.toFixed(2)
        });

        if (posY >= canvas.height - 40) {
          setIsRunning(false);
        }
      }

      // Draw Orbit Rocket Body
      ctx.beginPath();
      ctx.arc(posX, Math.min(canvas.height - 40, posY), 8, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f43f5e';
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleReset = () => {
    setIsRunning(false);
    setStats({ maxHeight: 0, distance: 0, time: 0 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="canvas-container" style={{ position: 'relative', height: '420px', borderRadius: 'var(--radius-xl)' }}>
        <canvas ref={canvasRef} width={850} height={420} style={{ width: '100%', height: '100%' }} />

        {/* Floating Telemetry Stats HUD Header (Matching Mockup) */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(12, 16, 36, 0.85)',
          backdropFilter: 'blur(12px)',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          display: 'flex',
          gap: '16px',
          zIndex: 20
        }}>
          <div>Gravity: <strong style={{ color: '#38bdf8' }}>{gravity} m/s²</strong></div>
          <div>Mass: <strong style={{ color: '#a855f7' }}>{mass} kg</strong></div>
          <div>Velocity: <strong style={{ color: '#34d399' }}>{velocity} m/s</strong></div>
          <div>Max Alt: <strong style={{ color: '#fbbf24' }}>{stats.maxHeight}m</strong></div>
        </div>
      </div>

      {/* Interactive Controls Sliders Panel (Matching Mockup) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        background: 'var(--bg-secondary)',
        padding: '20px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)'
      }}>
        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Gravity ({gravity} m/s²)</label>
          <input
            type="range"
            min="1"
            max="25"
            step="0.1"
            value={gravity}
            onChange={(e) => setGravity(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Object Mass ({mass} kg)</label>
          <input
            type="range"
            min="10"
            max="100"
            value={mass}
            onChange={(e) => setMass(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Velocity ({velocity} m/s)</label>
          <input
            type="range"
            min="10"
            max="100"
            value={velocity}
            onChange={(e) => setVelocity(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Launch Angle ({launchAngle}°)</label>
          <input
            type="range"
            min="15"
            max="85"
            value={launchAngle}
            onChange={(e) => setLaunchAngle(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pause Simulation' : 'Start Simulation'}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw size={16} /> Reset Lab
        </Button>
      </div>
    </div>
  );
};

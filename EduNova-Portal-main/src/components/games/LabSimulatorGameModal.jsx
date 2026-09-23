import React, { useState } from 'react';
import { X, FlaskConical, Play, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const LabSimulatorGameModal = ({ isOpen, onClose, onFinish }) => {
  const { theme } = useTheme() || {};
  const isLight = theme === 'light';

  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(20);
  const [simulationRan, setSimulationRan] = useState(false);

  if (!isOpen) return null;

  // Trajectory Physics Formula: Max Height H = (v * sin(theta))^2 / (2 * g)
  // Range R = v^2 * sin(2*theta) / g
  const g = 9.8;
  const rad = (angle * Math.PI) / 180;
  const maxHeight = ((velocity * Math.sin(rad)) ** 2) / (2 * g);
  const range = ((velocity ** 2) * Math.sin(2 * rad)) / g;

  const handleRunSimulation = () => {
    setSimulationRan(true);
  };

  const handleComplete = () => {
    onFinish({
      gameId: 'lab-simulator',
      gameTitle: '🧪 Virtual Optics & Trajectory Lab',
      score: 500,
      accuracy: 100,
      xpEarned: 220,
      durationSeconds: 45
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 22, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          borderRadius: '28px',
          background: isLight
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 246, 255, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(20, 30, 65, 0.95) 0%, rgba(12, 18, 42, 0.98) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.5)',
          boxShadow: '0 25px 65px rgba(56, 189, 248, 0.25)',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FlaskConical size={24} color="#38bdf8" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              🧪 Virtual Optics & Trajectory Lab
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#ffffff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Interactive Canvas Visualizer */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '180px',
          borderRadius: '20px',
          background: isLight ? 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)' : 'linear-gradient(180deg, #0f172a 0%, #090d24 100%)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          marginBottom: '20px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 400 180">
            <path
              d={`M 30 150 Q ${30 + range * 2} ${150 - maxHeight * 4}, ${30 + Math.min(340, range * 4)} 150`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray={simulationRan ? "none" : "5,5"}
            />
            <circle cx="30" cy="150" r="6" fill="#f59e0b" />
          </svg>

          <div style={{ position: 'absolute', bottom: '12px', right: '16px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '10px', color: '#ffffff', fontSize: '0.78rem', fontWeight: 800 }}>
            Angle: {angle}° | Velocity: {velocity} m/s
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', display: 'block', marginBottom: '6px' }}>
              Launch Angle θ ({angle}°)
            </label>
            <input
              type="range"
              min="15"
              max="75"
              value={angle}
              onChange={(e) => { setAngle(Number(e.target.value)); setSimulationRan(false); }}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', display: 'block', marginBottom: '6px' }}>
              Initial Velocity u ({velocity} m/s)
            </label>
            <input
              type="range"
              min="10"
              max="40"
              value={velocity}
              onChange={(e) => { setVelocity(Number(e.target.value)); setSimulationRan(false); }}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Calculated Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', background: 'rgba(56, 189, 248, 0.1)', padding: '14px', borderRadius: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block' }}>Max Height (H)</span>
            <strong style={{ fontSize: '1.2rem', color: '#38bdf8', fontWeight: 900 }}>{maxHeight.toFixed(2)} meters</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', display: 'block' }}>Horizontal Range (R)</span>
            <strong style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 900 }}>{range.toFixed(2)} meters</strong>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {!simulationRan ? (
            <button
              onClick={handleRunSimulation}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Play size={16} fill="#ffffff" /> Run Experiment Simulation
            </button>
          ) : (
            <button
              onClick={handleComplete}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '9999px',
                background: '#10b981',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={18} /> Complete Experiment Lab
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default LabSimulatorGameModal;

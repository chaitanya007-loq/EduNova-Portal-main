import React, { useState } from 'react';
import { Camera, Glasses, Compass, Sliders, Info, RefreshCw, Layers } from 'lucide-react';
import { Button } from '../common/Button';
import { ARCameraView } from './ARCameraView';
import { spatialTelemetryData } from '../../services/xrService';
import { Card } from '../common/Card';

export const XRCanvasPrototype = () => {
  const [mode, setMode] = useState('ar'); // 'ar' or 'vr'
  const [domainFilter, setDomainFilter] = useState('All');
  const [activeObjectName, setActiveObjectName] = useState('Atom Orbit Model');

  // 3D Gizmo Manipulator State
  const [rotationX, setRotationX] = useState(25);
  const [rotationY, setRotationY] = useState(45);
  const [scaleZoom, setScaleZoom] = useState(1.2);
  const [lightingPreset, setLightingPreset] = useState('Cosmic Observatory');

  const domains = ['All', 'Physics & Quantum', 'Biology & Genetics', 'History & Archeology', 'Engineering & CS'];

  const allSpatialObjects = [
    { id: 'atom', name: 'Atom Orbit Model', category: 'Physics & Quantum' },
    { id: 'blackhole', name: 'Black Hole Singularity', category: 'Physics & Quantum' },
    { id: 'quantum', name: 'Quantum Gate Circuit', category: 'Physics & Quantum' },
    { id: 'dna', name: 'DNA Double Helix', category: 'Biology & Genetics' },
    { id: 'synapse', name: 'Neural Synapse Network', category: 'Biology & Genetics' },
    { id: 'virus', name: 'Virus Bacteriophage', category: 'Biology & Genetics' },
    { id: 'pyramid', name: 'Great Pyramid of Giza', category: 'History & Archeology' },
    { id: 'colosseum', name: 'Roman Colosseum Architecture', category: 'History & Archeology' },
    { id: 'turbine', name: 'Cybernetic Turbine Engine', category: 'Engineering & CS' },
    { id: 'tree', name: 'Binary Tree Graph Node', category: 'Engineering & CS' },
    { id: 'gravity', name: 'Solar Gravitational Vector', category: 'Astronomy' }
  ];

  const filteredObjects = domainFilter === 'All'
    ? allSpatialObjects
    : allSpatialObjects.filter((o) => o.category === domainFilter);

  const telemetry = spatialTelemetryData[activeObjectName] || spatialTelemetryData['Atom Orbit Model'];

  const getLightingGradient = () => {
    switch (lightingPreset) {
      case 'Deep Void': return 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.35), #02040a 85%)';
      case 'Cyberpunk Matrix': return 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.35), #05141c 85%)';
      default: return 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.35), #050814 85%)';
    }
  };

  const handleResetGizmo = () => {
    setRotationX(25);
    setRotationY(45);
    setScaleZoom(1.0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Mode Switcher Header */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setMode('ar')}
          style={{
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            background: mode === 'ar' ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'var(--bg-secondary)',
            color: mode === 'ar' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontWeight: 700,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: mode === 'ar' ? '0 0 25px rgba(6, 182, 212, 0.45)' : 'none'
          }}
        >
          <Camera size={20} /> Live WebCam AR Hologram Studio
        </button>

        <button
          onClick={() => setMode('vr')}
          style={{
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            background: mode === 'vr' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-secondary)',
            color: mode === 'vr' ? '#fff' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            fontWeight: 700,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: mode === 'vr' ? '0 0 25px rgba(99, 102, 241, 0.45)' : 'none'
          }}
        >
          <Glasses size={20} /> 3D Interactive WebGL VR Room
        </button>
      </div>

      {/* Main Experience Viewport */}
      {mode === 'ar' ? (
        <ARCameraView activeObject={activeObjectName} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 3D WebGL VR Room Viewport */}
          <div style={{
            height: '480px',
            background: getLightingGradient(),
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-glow)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Central 3D Object Render Node */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              textAlign: 'center',
              transform: `perspective(800px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scaleZoom})`,
              transition: 'transform 0.1s ease-out'
            }}>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '32px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(6, 182, 212, 0.4))',
                border: '2px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 50px rgba(6, 182, 212, 0.65)',
                animation: 'floatSlow 4s ease-in-out infinite'
              }}>
                <Compass size={68} color="#38bdf8" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }} className="gradient-text">
                  {activeObjectName}
                </h3>
                <span className="cyber-badge-cyan" style={{ marginTop: '4px' }}>
                  {telemetry.category} • 3D WebGL Render
                </span>
              </div>
            </div>

            {/* VR Lighting Preset Floating Badge */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem'
            }}>
              Atmosphere: <strong style={{ color: '#38bdf8' }}>{lightingPreset}</strong>
            </div>
          </div>

          {/* 3D Gizmo Manipulator Controls */}
          <Card style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="#6366f1" /> 3D Spatial Manipulator Gizmo
              </h4>
              <Button size="sm" variant="ghost" onClick={handleResetGizmo}>
                <RefreshCw size={14} /> Reset View
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pitch Angle ({rotationX}°)</label>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={rotationX}
                  onChange={(e) => setRotationX(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Yaw Rotation ({rotationY}°)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationY}
                  onChange={(e) => setRotationY(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Zoom Scale ({scaleZoom.toFixed(1)}x)</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={scaleZoom}
                  onChange={(e) => setScaleZoom(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>VR Atmosphere Preset</label>
                <select
                  value={lightingPreset}
                  onChange={(e) => setLightingPreset(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Cosmic Observatory">Cosmic Observatory</option>
                  <option value="Deep Void">Deep Void Laboratory</option>
                  <option value="Cyberpunk Matrix">Cyberpunk Matrix</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Domain Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setDomainFilter(dom)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: domainFilter === dom ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-secondary)',
              color: domainFilter === dom ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Spatial Object Chips List */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {filteredObjects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => setActiveObjectName(obj.name)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: activeObjectName === obj.name ? 'linear-gradient(135deg, #06b6d4, #6366f1)' : 'var(--bg-tertiary)',
              color: activeObjectName === obj.name ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            🌐 {obj.name}
          </button>
        ))}
      </div>

      {/* Multi-Domain Telemetry Inspection Sheet */}
      <Card style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.12))',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Info size={20} color="#38bdf8" />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            Spatial Telemetry Sheet: {activeObjectName}
          </h4>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
          {telemetry.description}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          background: 'var(--bg-tertiary)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem'
        }}>
          <div>Domain: <strong style={{ color: '#38bdf8' }}>{telemetry.category}</strong></div>
          <div>Velocity / Rate: <strong style={{ color: '#34d399' }}>{telemetry.angularVelocity}</strong></div>
          <div>Flux Field: <strong style={{ color: '#fbbf24' }}>{telemetry.magneticFlux}</strong></div>
          <div>Mass / Spec: <strong style={{ color: '#a855f7' }}>{telemetry.mass || telemetry.diameter || telemetry.height || 'Standard Spec'}</strong></div>
        </div>
      </Card>
    </div>
  );
};

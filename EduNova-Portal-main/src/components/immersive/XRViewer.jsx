import React, { useState, useRef } from 'react';
import { VirtualEnvironment } from './VirtualEnvironment';
import { ImmersiveControls } from './ImmersiveControls';
import { ARModelViewer } from '../ar/ARModelViewer';
import { arObjectsRegistry } from '../../data/arObjects';
import { useXR } from '../../hooks/useXR';
import { ShieldCheck, Glasses, Sparkles, Award } from 'lucide-react';

export const XRViewer = ({ onAskSage, onRewardXP }) => {
  const { isSupported, deviceName, isInVRMode, sessionDetails, enterVR, exitVR } = useXR();
  const [envPreset, setEnvPreset] = useState('deep-space');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeObject, setActiveObject] = useState(arObjectsRegistry[0]); // Human Heart
  const containerRef = useRef(null);

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
      setIsFullscreen(false);
    }
  };

  const handleWebXR = async () => {
    const details = await enterVR();
    if (onRewardXP) {
      onRewardXP(25, '3D Virtual Classroom VR');
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : '540px',
        background: '#040711',
        borderRadius: isFullscreen ? '0' : 'var(--radius-xl)',
        border: '2px solid rgba(99, 102, 241, 0.4)',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
      }}
    >
      {/* 1. VR 3D Atmosphere Background */}
      <VirtualEnvironment envPreset={envPreset} />

      {/* 2. Top Spatial Telemetry HUD Header */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(12, 16, 36, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-color)',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.82rem',
        zIndex: 30
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isSupported ? '#10b981' : '#38bdf8', fontWeight: 700 }}>
            <Glasses size={16} /> {isSupported ? 'WEBXR READY (6DOF)' : '3D IMMERSIVE CLASSROOM MODE'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>Device: <strong style={{ color: '#fff' }}>{deviceName}</strong></span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: '#a855f7', fontWeight: 700 }}>360° SPATIAL TRACKING</span>
          {isInVRMode && (
            <button onClick={exitVR} style={{ padding: '2px 8px', borderRadius: '4px', background: '#f43f5e', color: '#fff', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}>
              Exit VR
            </button>
          )}
        </div>
      </div>

      {/* 3. Central Floating Educational 3D Model */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <ARModelViewer activeObjectData={activeObject} transform={{ rotX: 0, rotY: 20, scale: 1.1 }} />
      </div>

      {/* 4. Bottom Immersive Controls (Atmosphere presets, Fullscreen, WebXR) */}
      <ImmersiveControls
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        envPreset={envPreset}
        onChangeEnvPreset={setEnvPreset}
        onEnterWebXR={handleWebXR}
      />
    </div>
  );
};

export default XRViewer;

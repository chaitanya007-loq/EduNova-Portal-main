import React from 'react';
import { Camera, Box, Compass, Glasses, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const XRModeSelector = ({ activeMode, onSelectMode, capabilities = {} }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const modes = [
    {
      id: 'ar',
      label: 'AR Camera',
      icon: Camera,
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
      supported: capabilities.cameraAvailable || capabilities.arSupported,
      badgeText: capabilities.arSupported ? 'WebXR AR Ready' : capabilities.cameraAvailable ? 'Camera Ready' : 'AR Fallback'
    },
    {
      id: '3d',
      label: '3D Explore',
      icon: Box,
      gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      supported: capabilities.webgl2Supported !== false,
      badgeText: 'WebGL 3D Active'
    },
    {
      id: '360',
      label: '360° View',
      icon: Compass,
      gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      supported: true,
      badgeText: capabilities.gyroscopeAvailable ? 'Gyro Motion Ready' : 'Touch/Mouse Pan'
    },
    {
      id: 'vr',
      label: 'Enter VR',
      icon: Glasses,
      gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
      supported: capabilities.vrSupported,
      badgeText: capabilities.vrSupported ? 'WebXR VR Headset' : 'Cardboard / Stereo'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          background: isLight ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 244, 255, 0.82) 100%)' : 'rgba(15, 23, 42, 0.65)',
          padding: '8px',
          borderRadius: '16px',
          border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(56, 189, 248, 0.2)',
          boxShadow: isLight ? '0 16px 40px rgba(180, 200, 230, 0.35)' : 'none',
          backdropFilter: 'blur(16px)'
        }}
      >
        {modes.map(mode => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? mode.gradient : (isLight ? 'rgba(240, 246, 255, 0.8)' : 'rgba(30, 41, 59, 0.5)'),
                color: isActive ? '#ffffff' : (isLight ? '#52668a' : '#94a3b8'),
                border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : (isLight ? '1px solid rgba(200, 218, 240, 0.7)' : '1px solid rgba(255, 255, 255, 0.05)'),
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive ? '0 8px 25px rgba(56, 189, 248, 0.35)' : 'none'
              }}
            >
              <Icon size={18} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '8px 16px',
          background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(5, 8, 20, 0.5)',
          borderRadius: '10px',
          border: isLight ? '1px solid rgba(200, 218, 240, 0.7)' : '1px solid rgba(56, 189, 248, 0.15)',
          fontSize: '0.78rem',
          color: isLight ? '#52668a' : '#94a3b8'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: isLight ? '#0284c7' : '#38bdf8', fontWeight: 700 }}>Device Status:</span>
          <span style={{ color: isLight ? '#18345F' : '#ffffff' }}>{capabilities.deviceName || 'Standard Display'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {capabilities.webgl2Supported !== false ? <CheckCircle size={14} color="#10b981" /> : <AlertTriangle size={14} color="#f59e0b" />}
            <span style={{ color: isLight ? '#18345F' : '#ffffff' }}>WebGL 3D</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {capabilities.cameraAvailable ? <CheckCircle size={14} color="#10b981" /> : <AlertTriangle size={14} color="#94a3b8" />}
            <span style={{ color: isLight ? '#18345F' : '#ffffff' }}>Camera</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {capabilities.vrSupported ? <CheckCircle size={14} color="#10b981" /> : <span style={{ color: '#a855f7' }}>Stereo Fallback</span>}
            <span style={{ color: isLight ? '#18345F' : '#ffffff' }}>WebXR VR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XRModeSelector;

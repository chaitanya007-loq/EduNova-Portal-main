import React from 'react';
import { Maximize2, Minimize2, RotateCcw, Glasses, Compass, Eye } from 'lucide-react';

export const ImmersiveControls = ({
  isFullscreen,
  onToggleFullscreen,
  envPreset,
  onChangeEnvPreset,
  onResetView,
  onEnterWebXR
}) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      left: '16px',
      right: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 35,
      pointerEvents: 'auto'
    }}>
      {/* Atmosphere Selector */}
      <div style={{
        display: 'flex',
        gap: '6px',
        background: 'rgba(12, 16, 36, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '6px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        {[
          { id: 'deep-space', label: '🌌 Deep Space' },
          { id: 'cyberpunk-neon', label: '🌆 Cyber Neon' },
          { id: 'white-lab', label: '🔬 White Lab' }
        ].map(preset => (
          <button
            key={preset.id}
            onClick={() => onChangeEnvPreset(preset.id)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: envPreset === preset.id ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
              color: envPreset === preset.id ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onEnterWebXR}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.82rem',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'
          }}
        >
          <Glasses size={16} /> Enter WebXR VR Mode
        </button>

        <button
          onClick={onToggleFullscreen}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(12, 16, 36, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#ffffff',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Toggle Fullscreen View"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ImmersiveControls;

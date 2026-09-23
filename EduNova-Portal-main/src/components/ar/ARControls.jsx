import React from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move, Sparkles, Layers, Eye, RefreshCw, Compass } from 'lucide-react';

export const ARControls = ({
  transform = { rotX: 0, rotY: 0, scale: 1 },
  onTransformChange,
  onReset,
  onAskSage,
  showHotspots = true,
  onToggleHotspots
}) => {
  const handleRotateLeft = () => {
    onTransformChange({ ...transform, rotY: (transform.rotY - 30) % 360 });
  };

  const handleRotateRight = () => {
    onTransformChange({ ...transform, rotY: (transform.rotY + 30) % 360 });
  };

  const handleTiltUp = () => {
    onTransformChange({ ...transform, rotX: Math.min(60, (transform.rotX || 0) + 15) });
  };

  const handleTiltDown = () => {
    onTransformChange({ ...transform, rotX: Math.max(-60, (transform.rotX || 0) - 15) });
  };

  const handleZoomIn = () => {
    onTransformChange({ ...transform, scale: Math.min(2.2, transform.scale + 0.15) });
  };

  const handleZoomOut = () => {
    onTransformChange({ ...transform, scale: Math.max(0.5, transform.scale - 0.15) });
  };

  const setAnglePreset = (yawAngle) => {
    onTransformChange({ ...transform, rotY: yawAngle, rotX: 0 });
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 35
    }}>
      {/* 360° Angle View Preset Selector Bar */}
      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(12, 16, 36, 0.92)',
        backdropFilter: 'blur(10px)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        marginBottom: '4px'
      }}>
        <button onClick={() => setAnglePreset(0)} style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: '4px', background: transform.rotY === 0 ? '#06b6d4' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Front (0°)
        </button>
        <button onClick={() => setAnglePreset(90)} style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: '4px', background: transform.rotY === 90 ? '#06b6d4' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Side (90°)
        </button>
        <button onClick={() => setAnglePreset(180)} style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: '4px', background: transform.rotY === 180 ? '#06b6d4' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Back (180°)
        </button>
      </div>

      {/* Zoom In */}
      <button
        onClick={handleZoomIn}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        title="Zoom In Model (+)"
      >
        <ZoomIn size={18} />
      </button>

      {/* Zoom Out */}
      <button
        onClick={handleZoomOut}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        title="Zoom Out Model (-)"
      >
        <ZoomOut size={18} />
      </button>

      {/* 360° Rotate Y Left/Right Controls */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={handleRotateLeft}
          style={{
            flex: 1,
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-color)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 700
          }}
          title="Rotate Yaw Left 30°"
        >
          <RefreshCw size={14} /> -30°
        </button>

        <button
          onClick={handleRotateRight}
          style={{
            flex: 1,
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-color)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 700
          }}
          title="Rotate Yaw Right 30°"
        >
          <RefreshCw size={14} style={{ transform: 'scaleX(-1)' }} /> +30°
        </button>
      </div>

      {/* Toggle Hotspots */}
      <button
        onClick={onToggleHotspots}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: showHotspots ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${showHotspots ? '#06b6d4' : 'var(--border-color)'}`,
          color: showHotspots ? '#38bdf8' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        title="Toggle Interactive Hotspots"
      >
        <Layers size={18} />
      </button>

      {/* Reset Transform */}
      <button
        onClick={onReset}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)',
          color: '#f43f5e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        title="Reset Position & Scale"
      >
        <RotateCcw size={16} />
      </button>

      {/* Ask Sage AI Shortcut */}
      <button
        onClick={() => onAskSage && onAskSage('Explain the key component parts of this 3D model.')}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.6)'
        }}
        title="Ask Sage AI About Model"
      >
        <Sparkles size={18} />
      </button>
    </div>
  );
};

export default ARControls;

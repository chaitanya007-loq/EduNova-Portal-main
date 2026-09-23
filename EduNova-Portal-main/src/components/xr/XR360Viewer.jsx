import React, { useState, useRef, useEffect } from 'react';
import { Compass, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Smartphone } from 'lucide-react';
import { requestDeviceOrientationPermission } from '../../services/xrCapabilityService';

export const XR360Viewer = ({ experience }) => {
  const containerRef = useRef(null);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [gyroSupported, setGyroSupported] = useState(false);

  useEffect(() => {
    if (window.DeviceOrientationEvent) setGyroSupported(true);
  }, []);

  const handleEnableGyro = async () => {
    const granted = await requestDeviceOrientationPermission();
    if (granted) {
      setGyroEnabled(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  const handleOrientation = e => {
    if (e.alpha !== null && e.beta !== null) {
      setYaw(e.alpha);
      setPitch(Math.max(-45, Math.min(45, e.beta - 45)));
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleMouseDown = e => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = e => {
    if (!isDragging || gyroEnabled) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setYaw(prev => (prev + dx * 0.3) % 360);
    setPitch(prev => Math.max(-60, Math.min(60, prev - dy * 0.3)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleKeyDown = e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') setYaw(prev => (prev - 10) % 360);
    if (e.key === 'ArrowRight' || e.key === 'd') setYaw(prev => (prev + 10) % 360);
    if (e.key === 'ArrowUp' || e.key === 'w') setPitch(prev => Math.min(60, prev + 10));
    if (e.key === 'ArrowDown' || e.key === 's') setPitch(prev => Math.max(-60, prev - 10));
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: 'relative',
        width: '100%',
        height: '680px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, #1e1b4b 0%, #050814 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        cursor: isDragging ? 'grabbing' : 'grab',
        outline: 'none'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          transform: `perspective(600px) rotateX(${pitch}deg) rotateY(${yaw}deg)`,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 60%),
                            linear-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(56, 189, 248, 0.15) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 50px 50px, 50px 50px',
          display: 'flex',
          alignItems: 'center',
          justify: 'center'
        }}
      >
        <div style={{ textAlign: 'center', color: '#fff', textShadow: '0 0 20px rgba(168, 85, 247, 0.8)' }}>
          <Compass size={80} color="#a855f7" className="animate-spin-slow" />
          <h2 style={{ fontSize: '1.8rem', margin: '16px 0 8px 0', fontWeight: 800 }}>
            {experience?.name || '360° Immersive Spatial Environment'}
          </h2>
          <p style={{ color: '#c084fc', fontSize: '0.94rem', maxWidth: '460px' }}>
            Drag mouse, swipe touch screen, or use WASD / Arrow keys to explore full 360° perspective.
          </p>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 40px)',
          gridTemplateRows: 'repeat(2, 40px)',
          gap: '6px',
          zIndex: 20
        }}
      >
        <div />
        <button onClick={() => setPitch(p => Math.min(60, p + 15))} style={arrowBtnStyle}>
          <ArrowUp size={18} />
        </button>
        <div />
        <button onClick={() => setYaw(y => (y - 15) % 360)} style={arrowBtnStyle}>
          <ArrowLeft size={18} />
        </button>
        <button onClick={() => setPitch(p => Math.max(-60, p - 15))} style={arrowBtnStyle}>
          <ArrowDown size={18} />
        </button>
        <button onClick={() => setYaw(y => (y + 15) % 360)} style={arrowBtnStyle}>
          <ArrowRight size={18} />
        </button>
      </div>

      {gyroSupported && (
        <button
          onClick={handleEnableGyro}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: gyroEnabled ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(15, 23, 42, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '10px 16px',
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(12px)',
            zIndex: 20
          }}
        >
          <Smartphone size={16} />
          <span>{gyroEnabled ? 'Gyro Tracking Active' : 'Enable Mobile Motion'}</span>
        </button>
      )}

      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(5, 8, 20, 0.75)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '0.78rem',
          color: '#cbd5e1',
          zIndex: 15
        }}
      >
        <div style={{ color: '#a855f7', fontWeight: 700, marginBottom: '4px' }}>360° Spatial Orientation</div>
        <div>Yaw: {Math.round(yaw)}°</div>
        <div>Pitch: {Math.round(pitch)}°</div>
      </div>
    </div>
  );
};

const arrowBtnStyle = {
  background: 'rgba(15, 23, 42, 0.85)',
  border: '1px solid rgba(168, 85, 247, 0.4)',
  color: '#ffffff',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justify: 'center',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)'
};

export default XR360Viewer;

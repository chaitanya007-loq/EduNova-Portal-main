import React, { useState } from 'react';
import { Eye, Sliders, X } from 'lucide-react';

export const XRStereoViewer = ({ experience, onClose }) => {
  const [ipdOffset, setIpdOffset] = useState(12);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000000',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '10px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(12px)',
          color: '#fff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Eye size={20} color="#38bdf8" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Cardboard / Stereo Mobile Split-Screen Mode</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
            <Sliders size={14} />
            <span>IPD Adjustment:</span>
            <input
              type="range"
              min="0"
              max="30"
              value={ipdOffset}
              onChange={e => setIpdOffset(Number(e.target.value))}
              style={{ width: '90px' }}
            />
          </div>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: '#f43f5e',
                border: 'none',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <X size={16} /> Exit Stereo View
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', width: '100%', height: '100%', background: '#000' }}>
        <div
          style={{
            flex: 1,
            height: '100%',
            borderRight: '2px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            transform: `translateX(-${ipdOffset}px)`,
            background: 'radial-gradient(circle at center, #1e1b4b 0%, #000 80%)'
          }}
        >
          <StereoSceneContent side="LEFT" experience={experience} />
        </div>

        <div
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            transform: `translateX(${ipdOffset}px)`,
            background: 'radial-gradient(circle at center, #1e1b4b 0%, #000 80%)'
          }}
        >
          <StereoSceneContent side="RIGHT" experience={experience} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '6px 18px',
          borderRadius: '20px',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          color: '#38bdf8',
          fontSize: '0.78rem',
          fontWeight: 700,
          zIndex: 100
        }}
      >
        📱 Insert phone into Google Cardboard or VR Headset Frame
      </div>
    </div>
  );
};

const StereoSceneContent = ({ side, experience }) => (
  <div style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>
    <div
      style={{
        width: '110px',
        height: '110px',
        borderRadius: '50%',
        background: side === 'LEFT' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        margin: '0 auto 16px auto',
        boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        fontSize: '1.1rem',
        fontWeight: 800
      }}
    >
      {side} EYE
    </div>
    <h3 style={{ fontSize: '1.05rem', margin: '0 0 6px 0', fontWeight: 800 }}>{experience?.name || 'Stereo 3D Model'}</h3>
    <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Stereoscopic parallax rendering active</p>
  </div>
);

export default XRStereoViewer;

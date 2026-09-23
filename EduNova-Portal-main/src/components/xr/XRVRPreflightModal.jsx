import React, { useState, useEffect } from 'react';
import { Glasses, CheckCircle, AlertCircle, Play, Eye, Compass, X } from 'lucide-react';
import { getXRCapabilities } from '../../services/xrCapabilityService';

export const XRVRPreflightModal = ({ isOpen, onClose, onLaunchStereo, onLaunch360 }) => {
  const [loading, setLoading] = useState(true);
  const [caps, setCaps] = useState({});

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getXRCapabilities().then(res => {
        setCaps(res);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'radial-gradient(circle at top left, #1e1b4b 0%, #0f172a 100%)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          borderRadius: '24px',
          padding: '28px',
          color: '#ffffff',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
            }}
          >
            <Glasses size={28} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Preparing Immersive VR Experience</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.84rem' }}>Running WebXR device diagnostic check</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <CheckItem label="3D WebGL Graphic Pipeline" status={caps.webgl2Supported !== false} detail="Hardware accelerated 3D canvas" />
          <CheckItem label="Native WebXR Session API" status={caps.webxrSupported} detail={caps.webxrSupported ? 'navigator.xr API detected' : 'WebXR API not found on browser'} />
          <CheckItem label="Immersive VR Headset Support" status={caps.vrSupported} detail={caps.vrStatusText} />
          <CheckItem label="Controller & Motion Input" status={caps.vrSupported || caps.gyroscopeAvailable} detail={caps.gyroscopeAvailable ? 'Orientation sensor available' : 'Standard pointer input'} />
        </div>

        {caps.vrSupported ? (
          <button
            onClick={() => alert('Launching Native WebXR Session... Please put on your VR headset.')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Play size={18} /> Enter WebXR Immersive VR
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f43f5e',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={18} />
              <span>VR hardware is not connected or WebXR is unavailable on this device.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={onLaunchStereo}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '6px'
                }}
              >
                <Eye size={16} /> Cardboard Stereo View
              </button>

              <button
                onClick={onLaunch360}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '6px'
                }}
              >
                <Compass size={16} /> Continue in 360° Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CheckItem = ({ label, status, detail }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      padding: '10px 14px',
      borderRadius: '12px',
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}
  >
    <div>
      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#f8fafc' }}>{label}</div>
      <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{detail}</div>
    </div>
    {status ? <CheckCircle size={18} color="#10b981" /> : <AlertCircle size={18} color="#f59e0b" />}
  </div>
);

export default XRVRPreflightModal;

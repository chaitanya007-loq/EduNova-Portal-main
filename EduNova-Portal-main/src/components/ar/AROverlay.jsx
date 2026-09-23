import React from 'react';
import { ShieldCheck, Sparkles, Camera, CheckCircle2, Scan, Eye, Layers, Upload } from 'lucide-react';
import { Button } from '../common/Button';

export const AROverlay = ({
  isScanning,
  detectedResult,
  onScanTrigger,
  onOpenModelSelector,
  onUploadTrigger,
  onAskSage,
  activeObjectName,
  isCustomUpload
}) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
      {/* 1. TOP HUD STATUS HEADER */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'auto',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Detection Badge */}
        <div style={{
          background: 'rgba(12, 16, 36, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(6, 182, 212, 0.45)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {isCustomUpload ? '✂️ AI Background Removed 3D Model' : 'AI Vision Recognition'}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
              {detectedResult ? detectedResult.name : activeObjectName || 'Selected 3D Model'}
            </div>
          </div>
        </div>

        {/* Confidence Percentage Badge */}
        <div style={{
          background: 'rgba(12, 16, 36, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(168, 85, 247, 0.45)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          fontWeight: 800,
          color: '#c084fc',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          {detectedResult ? detectedResult.confidencePercent : '3D MODEL FIT'}
        </div>
      </div>

      {/* 2. CENTER AI SCANNING RETICLE BEAM */}
      {isScanning && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(4, 7, 17, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 40
        }}>
          {/* Target Box */}
          <div style={{
            width: '240px',
            height: '240px',
            border: '2px dashed #06b6d4',
            borderRadius: '24px',
            position: 'relative',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)'
          }}>
            {/* Scanning Beam */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #06b6d4, #a855f7, transparent)',
              boxShadow: '0 0 15px #06b6d4',
              animation: 'scanBeam 1.5s infinite linear'
            }} />
          </div>

          <p style={{
            color: '#38bdf8',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginTop: '20px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            animation: 'pulse 1s infinite'
          }}>
            Processing Image • Removing Background & Extruding 3D VR Model...
          </p>
        </div>
      )}

      {/* 3. BOTTOM HUD ACTION BAR */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        pointerEvents: 'auto'
      }}>
        {/* Scan Button */}
        <button
          onClick={onScanTrigger}
          disabled={isScanning}
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
          }}
        >
          <Scan size={16} /> {isScanning ? 'Scanning...' : 'Scan Env'}
        </button>

        {/* Upload Object Photo Button (Background Removal Trigger) */}
        <button
          onClick={onUploadTrigger}
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
          }}
          title="Upload Object Photo (AI Background Removal & 3D Conversion)"
        >
          <Upload size={16} /> Upload Photo 📸
        </button>

        {/* Change Model Registry Button */}
        <button
          onClick={onOpenModelSelector}
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Layers size={16} /> Models
        </button>

        {/* Ask Sage Button */}
        <button
          onClick={() => onAskSage && onAskSage('What is this educational object and why is it important?')}
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(168, 85, 247, 0.25)',
            backdropFilter: 'blur(10px)',
            color: '#c084fc',
            fontWeight: 600,
            fontSize: '0.85rem',
            border: '1px solid rgba(168, 85, 247, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={16} /> Ask Sage
        </button>
      </div>
    </div>
  );
};

export default AROverlay;

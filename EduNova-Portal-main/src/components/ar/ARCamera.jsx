import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Layers, ShieldCheck, Download, Sparkles, Upload, Eye } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { visionService } from '../../services/visionService';
import { convertImageTo3DSpatialModel } from '../../services/imageTo3DService';
import { arObjectsRegistry } from '../../data/arObjects';
import { XR_MODELS } from '../../data/xrModels';
import { AROverlay } from './AROverlay';
import { ARModelViewer } from './ARModelViewer';
import { ARHotspots } from './ARHotspots';
import { ARControls } from './ARControls';
import { ObjectRecognitionCard } from './ObjectRecognitionCard';
import { Modal } from '../common/Modal';
import { useTheme } from '../../context/ThemeContext';

// Live 60fps Simulated AR Spatial Camera Feed Canvas Renderer
const ARCameraCanvasFeed = ({ isScanning }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 720);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 480);
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Ambient handheld camera tilt & pan simulation
      const camOffsetX = Math.sin(time * 0.8) * 15;
      const camOffsetY = Math.cos(time * 0.6) * 10;

      ctx.save();
      ctx.translate(cx + camOffsetX, cy + camOffsetY);

      // 1. Dark Room Radial Optics Gradient
      const roomBg = ctx.createRadialGradient(0, 0, 80, 0, 0, Math.max(width, height) * 0.7);
      roomBg.addColorStop(0, '#091322');
      roomBg.addColorStop(0.6, '#050a14');
      roomBg.addColorStop(1, '#020409');
      ctx.fillStyle = roomBg;
      ctx.fillRect(-width, -height, width * 2, height * 2);

      // 2. 3D Spatial Tabletop Surface Grid (Perspective vanishing lines)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.lineWidth = 1;
      const horizonY = 40;

      for (let x = -width; x <= width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, horizonY);
        ctx.lineTo(x * 2.5, height);
        ctx.stroke();
      }

      for (let y = horizonY; y <= height; y += 25) {
        const perspectiveY = horizonY + Math.pow((y - horizonY) / (height - horizonY), 1.6) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(-width, perspectiveY);
        ctx.lineTo(width, perspectiveY);
        ctx.stroke();
      }

      // 3. Floating Spatial Depth Point Cloud
      const points = 35;
      for (let i = 0; i < points; i++) {
        const pX = Math.sin(time + i * 1.5) * (width * 0.45);
        const pY = Math.cos(time * 0.9 + i * 2.1) * (height * 0.35);
        const pSize = 1.5 + Math.sin(time * 2 + i) * 1.2;

        ctx.beginPath();
        ctx.arc(pX, pY, pSize, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#06b6d4' : '#6366f1';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Optical Lens Scanning Crosshair Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-35, 0); ctx.lineTo(35, 0);
      ctx.moveTo(0, -35); ctx.lineTo(0, 35);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Scanning Beam Overlay (when scanning)
      if (isScanning) {
        const scanY = -height / 2 + ((time * 300) % height);
        const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
        scanGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        scanGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.55)');
        scanGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = scanGrad;
        ctx.fillRect(-width / 2, scanY - 20, width, 40);

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-width / 2, scanY);
        ctx.lineTo(width / 2, scanY);
        ctx.stroke();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isScanning]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
};

export const ARCamera = ({ onAskSage, onRewardXP, model, experience }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { videoRef, streamActive, isScanning, setIsScanning, error, permissionState, captureFrame, startCamera, switchCamera } = useCamera();
  const fileInputRef = useRef(null);

  const initialModel = model || experience || arObjectsRegistry[0];
  const [activeObject, setActiveObject] = useState(initialModel);
  const [detectedResult, setDetectedResult] = useState(null);
  const [transform, setTransform] = useState({ rotX: 0, rotY: 0, scale: 1 });
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [showModelModal, setShowModelModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-start webcam when ARCamera component mounts
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  // Sync activeObject whenever model or experience prop changes from parent (e.g. domain model selector)
  useEffect(() => {
    const nextModel = model || experience;
    if (nextModel) {
      setActiveObject(nextModel);
      setDetectedResult(null);
      setTransform({ rotX: 0, rotY: 0, scale: 1 });
      setActiveHotspot(null);
    }
  }, [model, experience]);

  // Trigger AI Vision Scan
  const handleScan = async () => {
    setIsScanning(true);
    captureFrame();

    const result = await visionService.analyzeFrame('frame_data', { forcedObjectId: activeObject.id });

    setDetectedResult(result);
    setIsScanning(false);

    if (onRewardXP) {
      onRewardXP(25, result.name);
    }
  };

  // Handle Upload Object Image & Remove Background to convert to 3D Spatial Model
  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsScanning(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;

      // Process image: Background removal & 3D conversion
      const customSpatialModel = await convertImageTo3DSpatialModel(dataUrl, file.name);

      setActiveObject(customSpatialModel);
      setDetectedResult({
        name: customSpatialModel.name,
        category: customSpatialModel.category,
        confidencePercent: '98% CONFIDENCE'
      });
      setIsScanning(false);
      setTransform({ rotX: 0, rotY: 0, scale: 1 });

      if (onRewardXP) {
        onRewardXP(30, `Custom 3D ${customSpatialModel.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectObject = (obj) => {
    setActiveObject(obj);
    setDetectedResult(null);
    setTransform({ rotX: 0, rotY: 0, scale: 1 });
    setActiveHotspot(null);
    setShowModelModal(false);
  };

  const handleResetTransform = () => {
    setTransform({ rotX: 0, rotY: 0, scale: 1 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Main Fullscreen AR Camera Viewport */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: isExpanded ? '820px' : '680px',
        background: '#040711',
        borderRadius: 'var(--radius-xl)',
        border: '2px solid rgba(6, 182, 212, 0.4)',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        transition: 'height 0.3s ease'
      }}>
        {/* 1. Real Live Video Camera Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: streamActive ? 'block' : 'none',
            zIndex: 3
          }}
        />

        {/* 2. Simulated AR Spatial Camera Feed (Active when streamActive is false or initializing) */}
        {!streamActive && (
          <ARCameraCanvasFeed isScanning={isScanning} />
        )}

        {/* 3. Quick Camera Control Pills */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <button
            onClick={() => startCamera()}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: streamActive ? 'rgba(16, 185, 129, 0.3)' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#ffffff',
              border: `1px solid ${streamActive ? '#10b981' : 'rgba(255, 255, 255, 0.3)'}`,
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
            }}
          >
            <Camera size={15} />
            {streamActive ? 'Live Webcam Active' : 'Enable Live Webcam'}
          </button>

          <button
            onClick={() => switchCamera()}
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)'
            }}
            title="Switch Camera Device (Front/Rear)"
          >
            <RefreshCw size={14} /> Switch Device
          </button>
        </div>

        {/* 3b. Camera Status Warning / Permission Overlay */}
        {error && (
          <div style={{
            position: 'absolute',
            bottom: '75px',
            left: '16px',
            right: '16px',
            zIndex: 35,
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '14px',
            padding: '12px 16px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                <Camera size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f87171' }}>Camera Notification</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{error}</div>
              </div>
            </div>
            <button
              onClick={() => startCamera()}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Retry Camera
            </button>
          </div>
        )}

        {/* 4. 3D Model Viewer Layer (Supports custom background-removed 3D models) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
          <ARModelViewer
            activeObjectData={activeObject}
            transform={transform}
            activeHotspot={activeHotspot}
          />
        </div>

        {/* 5. Interactive Hotspots Layer */}
        {showHotspots && (
          <ARHotspots
            hotspots={activeObject.hotspots}
            activeHotspot={activeHotspot}
            onSelectHotspot={(hs) => setActiveHotspot(hs)}
            onAskSage={onAskSage}
          />
        )}

        {/* 6. AROverlay Scanning HUD Header & Bottom Action Bar */}
        <AROverlay
          isScanning={isScanning}
          detectedResult={detectedResult}
          activeObjectName={activeObject.name}
          isCustomUpload={activeObject.isCustomUpload}
          onScanTrigger={handleScan}
          onUploadTrigger={() => fileInputRef.current && fileInputRef.current.click()}
          onOpenModelSelector={() => setShowModelModal(true)}
          onAskSage={onAskSage}
        />

        {/* 7. Touch Transform Controls (Rotate, Zoom, Reset) */}
        <ARControls
          transform={transform}
          onTransformChange={setTransform}
          onReset={handleResetTransform}
          onAskSage={onAskSage}
          showHotspots={showHotspots}
          onToggleHotspots={() => setShowHotspots(!showHotspots)}
        />
      </div>

      {/* Recognized Object Metadata Card */}
      <ObjectRecognitionCard
        objectData={activeObject}
        onExplore={() => setShowHotspots(true)}
        onAskSage={onAskSage}
        xpEarned={activeObject.isCustomUpload ? 30 : 25}
      />

      {/* Model Library Selection Modal */}
      <Modal
        isOpen={showModelModal}
        onClose={() => setShowModelModal(false)}
        title="Select 3D Educational Model"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[...XR_MODELS, ...arObjectsRegistry.filter(a => !XR_MODELS.some(m => m.id === a.id))].map(obj => (
            <div
              key={obj.id}
              onClick={() => handleSelectObject(obj)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: activeObject.id === obj.id ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-tertiary)',
                border: `1px solid ${activeObject.id === obj.id ? '#06b6d4' : 'var(--border-color)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span className="cyber-badge-cyan" style={{ fontSize: '0.7rem' }}>{obj.category}</span>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>{obj.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                {obj.hotspots?.length || 0} Hotspots • {obj.topic || obj.topics?.[0] || obj.category}
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ARCamera;


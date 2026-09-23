import React, { useState, useEffect } from 'react';
import { Sparkles, Glasses, Award, BookOpen, Layers, Zap, RotateCcw, Target, HelpCircle, Eye, ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';
import { XRModeSelector } from '../../components/xr/XRModeSelector';
import { XRModelSelector } from '../../components/xr/XRModelSelector';
import { XR3DViewer } from '../../components/xr/XR3DViewer';
import { XR360Viewer } from '../../components/xr/XR360Viewer';
import { XRStereoViewer } from '../../components/xr/XRStereoViewer';
import { XRVRPreflightModal } from '../../components/xr/XRVRPreflightModal';
import { SageSpatialTutor } from '../../components/xr/SageSpatialTutor';
import { XRChallengeMode } from '../../components/xr/XRChallengeMode';
import { XRQuizMode } from '../../components/xr/XRQuizMode';
import { XRNotebookModal } from '../../components/xr/XRNotebookModal';
import { ARCamera } from '../../components/ar/ARCamera';
import { getXRCapabilities } from '../../services/xrCapabilityService';
import { xrSessionService } from '../../services/xrSessionService';
import { getEducationContext } from '../../services/educationContextService';
import { XR_MODELS, getModelsByContext } from '../../data/xrModels';
import { xrProgressService } from '../../services/xrProgressService';
import { Modal } from '../../components/common/Modal';
import { EduNovaHeroBanner } from '../../components/common/EduNovaHeroBanner';
import { useTheme } from '../../context/ThemeContext';

export const XRStudioPage = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [capabilities, setCapabilities] = useState({});
  const [learnerContext, setLearnerContext] = useState(getEducationContext());
  const [activeMode, setActiveMode] = useState('3d'); // '3d' | '360' | 'ar' | 'vr'
  const [activeTabRight, setActiveTabRight] = useState('tutor'); // 'tutor' | 'challenge' | 'quiz'

  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [xpBonus, setXpBonus] = useState(null);

  // Modals & Viewports
  const [showVRPreflight, setShowVRPreflight] = useState(false);
  const [showStereoMode, setShowStereoMode] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Initialize capabilities and models
  useEffect(() => {
    getXRCapabilities().then(setCapabilities);
    const ctx = getEducationContext();
    setLearnerContext(ctx);

    const models = getModelsByContext(ctx);
    if (models.length > 0) {
      setSelectedModel(models[0]);
    } else {
      const fallback = XR_MODELS.filter(m => ctx.educationType === 'school' ? true : m.id !== 'human-heart');
      setSelectedModel(fallback[0] || XR_MODELS[0]);
    }
  }, []);

  const availableModels = getModelsByContext(learnerContext);

  const handleModeSelect = modeId => {
    if (modeId === 'vr') {
      setShowVRPreflight(true);
    } else {
      setActiveMode(modeId);
    }
  };

  const handleRewardXP = (amount, itemName) => {
    setXpBonus({ amount, itemName });
    setTimeout(() => setXpBonus(null), 4000);
  };

  const handleHotspotSelect = hotspot => {
    setSelectedHotspot(hotspot);
    if (selectedModel) {
      xrProgressService.saveProgress(selectedModel.id, {
        hotspotsViewed: Array.from(new Set([...(xrProgressService.getProgress(selectedModel.id).hotspotsViewed || []), hotspot.name]))
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#ffffff', width: '100%', paddingBottom: '40px' }}>
      
      {/* 1. HERO BRANDING HEADER WITH 3D GLASS ORB */}
      <EduNovaHeroBanner
        badge="✦ WebXR • AR • VR • 3D Immersive Studio"
        title="Enter Immersive Learning"
        subtitle="Spatial computing ecosystem: AR mode, VR mode, 3D educational models, object detection, & Sage AI spatial tutor."
        stats={[
          { label: 'Spatial 3D', subtext: 'Interactive Models', icon: Glasses, color: '#38bdf8', iconBg: 'rgba(56, 189, 248, 0.25)' },
          { label: 'WebXR Ready', subtext: 'AR / VR Mode', icon: Sparkles, color: '#c084fc', iconBg: 'rgba(192, 132, 252, 0.25)' },
          { label: '3', subtext: 'Learning Goals', isPill: true }
        ]}
      />

      {/* Quick Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '-8px' }}>
        <button
          onClick={() => setShowCompareModal(true)}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(30, 41, 59, 0.85)',
            border: isLight ? '1px solid rgba(200, 218, 240, 0.8)' : '1px solid rgba(56, 189, 248, 0.3)',
            color: isLight ? '#0284c7' : '#38bdf8',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={16} /> Compare Mode
        </button>

        <button
          onClick={() => setShowNotebook(true)}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
          }}
        >
          <BookOpen size={16} /> XR Notebook
        </button>
      </div>

      {/* 2. CORE XR MODE SELECTOR */}
      <XRModeSelector activeMode={activeMode} onSelectMode={handleModeSelect} capabilities={capabilities} />

      {/* 3. DYNAMIC DOMAIN MODEL SELECTOR */}
      <XRModelSelector selectedModelId={selectedModel?.id} onSelectModel={setSelectedModel} learnerContext={learnerContext} />

      {/* 4. MAIN IMMERSIVE VIEWPORT GRID - Expand 3D canvas viewport to the right */}
      <div className="xr-main-grid">
        
        {/* Left Interactive 3D Canvas / Viewport */}
        <div style={{ width: '100%', minWidth: 0 }}>
          {activeMode === '3d' && (
            <XR3DViewer experience={selectedModel} onSelectHotspot={handleHotspotSelect} onAskSage={() => setActiveTabRight('tutor')} />
          )}
          {activeMode === '360' && (
            <XR360Viewer experience={selectedModel} />
          )}
          {activeMode === 'ar' && (
            <ARCamera model={selectedModel} experience={selectedModel} onAskSage={() => setActiveTabRight('tutor')} onRewardXP={handleRewardXP} />
          )}
        </div>

        {/* Right Interaction Sidebar (Sage Tutor, Challenge Mode, Adaptive Quiz) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', minWidth: 0 }}>
          {/* Sidebar Tab Navigation */}
          <div style={{ display: 'flex', gap: '4px', background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(15, 23, 42, 0.7)', padding: '4px', borderRadius: '12px', border: isLight ? '1px solid rgba(200, 218, 240, 0.7)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
            <TabButton active={activeTabRight === 'tutor'} isLight={isLight} onClick={() => setActiveTabRight('tutor')}>
              Sage AI Tutor
            </TabButton>
            <TabButton active={activeTabRight === 'challenge'} isLight={isLight} onClick={() => setActiveTabRight('challenge')}>
              Challenge
            </TabButton>
            <TabButton active={activeTabRight === 'quiz'} isLight={isLight} onClick={() => setActiveTabRight('quiz')}>
              Quiz
            </TabButton>
          </div>

          {activeTabRight === 'tutor' && (
            <SageSpatialTutor model={selectedModel} activeHotspot={selectedHotspot} context={learnerContext} onRewardXP={handleRewardXP} />
          )}
          {activeTabRight === 'challenge' && (
            <XRChallengeMode model={selectedModel} onSelectHotspot={handleHotspotSelect} onRewardXP={handleRewardXP} />
          )}
          {activeTabRight === 'quiz' && (
            <XRQuizMode model={selectedModel} onRewardXP={handleRewardXP} />
          )}
        </div>
      </div>

      {/* MODALS */}
      <XRVRPreflightModal
        isOpen={showVRPreflight}
        onClose={() => setShowVRPreflight(false)}
        onLaunchStereo={() => {
          setShowVRPreflight(false);
          setShowStereoMode(true);
        }}
        onLaunch360={() => {
          setShowVRPreflight(false);
          setActiveMode('360');
        }}
      />

      {showStereoMode && (
        <XRStereoViewer experience={selectedModel} onClose={() => setShowStereoMode(false)} />
      )}

      <XRNotebookModal isOpen={showNotebook} onClose={() => setShowNotebook(false)} experience={selectedModel} />

      <Modal isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} title="Spatial Model Compare Mode">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', color: isLight ? '#18345F' : '#fff' }}>
          <div style={{ background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid #06b6d4' }}>
            <h4 style={{ color: '#06b6d4', margin: '0 0 8px 0' }}>{selectedModel?.name || 'Selected Model'}</h4>
            <p style={{ fontSize: '0.84rem', color: isLight ? '#334155' : '#cbd5e1' }}>{selectedModel?.description}</p>
          </div>
          <div style={{ background: isLight ? 'rgba(240, 246, 255, 0.85)' : 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid #a855f7' }}>
            <h4 style={{ color: '#a855f7', margin: '0 0 8px 0' }}>Alternative Counterpart</h4>
            <p style={{ fontSize: '0.84rem', color: isLight ? '#334155' : '#cbd5e1' }}>Compare structure, function, and performance parameters in spatial space.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const TabButton = ({ children, active, isLight, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: '8px 10px',
      borderRadius: '8px',
      background: active ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'transparent',
      color: active ? '#ffffff' : (isLight ? '#52668a' : '#94a3b8'),
      border: 'none',
      fontWeight: 700,
      fontSize: '0.8rem',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export default XRStudioPage;

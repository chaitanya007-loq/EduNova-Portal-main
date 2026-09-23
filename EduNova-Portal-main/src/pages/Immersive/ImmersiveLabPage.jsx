import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ImmersiveLabHero from '../../components/labs/ImmersiveLabHero';
import LabControlCenter from '../../components/labs/LabControlCenter';
import LabLibrary from '../../components/labs/LabLibrary';
import LabViewer from '../../components/labs/LabViewer';
import DailyLabChallengeModal from '../../components/labs/DailyLabChallengeModal';
import LabNotebookModal from '../../components/labs/LabNotebookModal';
import { getEducationContext, switchEducationMode } from '../../services/educationContextService';
import { getLabProgress } from '../../services/labProgressService';
import { getLabById } from '../../services/labService';

export const ImmersiveLabPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [activeContext, setActiveContext] = useState(getEducationContext());
  const [progress, setProgress] = useState(getLabProgress());

  // Modals & Active Viewer States
  const [activeLabId, setActiveLabId] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  // Switch mode directly from Hero pill buttons
  const handleSwitchMode = (modeKey) => {
    const updated = switchEducationMode(modeKey);
    setActiveContext(updated);
  };

  // Callback when a lab experiment is completed & recorded
  const handleAttemptRecorded = () => {
    setProgress(getLabProgress());
  };

  const activeLabObj = activeLabId ? getLabById(activeLabId) : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        paddingBottom: '60px'
      }}
    >
      {/* Top Back Navigation */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '12px',
            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.75)',
            border: isLight ? '1px solid rgba(186, 230, 253, 0.7)' : '1px solid rgba(255, 255, 255, 0.15)',
            color: isLight ? '#0284c7' : '#38bdf8',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
            boxShadow: isLight ? '0 4px 15px rgba(37, 99, 235, 0.08)' : '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>

      {/* 1. Futuristic Hero Section */}
      <ImmersiveLabHero activeContext={activeContext} onSwitchMode={handleSwitchMode} />

      {/* 2. Control Center: Stats, Quick Resume, Daily Challenge */}
      <LabControlCenter
        progress={progress}
        activeContext={activeContext}
        onOpenLab={(labId) => setActiveLabId(labId)}
        onOpenChallenge={(ch) => setActiveChallenge(ch)}
        onOpenNotebook={() => setIsNotebookOpen(true)}
      />

      {/* 3. Searchable Multi-Domain Lab Library */}
      <LabLibrary
        activeContext={activeContext}
        progress={progress}
        onOpenLab={(labId) => setActiveLabId(labId)}
      />

      {/* 4. Active Interactive Laboratory Workspace Modal */}
      {activeLabObj && (
        <LabViewer
          lab={activeLabObj}
          onClose={() => setActiveLabId(null)}
          onAttemptRecorded={handleAttemptRecorded}
        />
      )}

      {/* 5. Daily Lab Challenge Modal */}
      {activeChallenge && (
        <DailyLabChallengeModal
          challenge={activeChallenge}
          isOpen={!!activeChallenge}
          onClose={() => setActiveChallenge(null)}
          onChallengeCompleted={() => {
            setProgress(getLabProgress());
          }}
        />
      )}

      {/* 6. Digital Practical Lab Notebook Modal */}
      <LabNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
      />
    </div>
  );
};

export default ImmersiveLabPage;

import React from 'react';
import { useKnowledgeGraph } from '../../hooks/useKnowledgeGraph';
import { ConstellationCanvas } from '../knowledge/ConstellationCanvas';
import { SkillDetailsDrawer } from '../knowledge/SkillDetailsDrawer';

export const KnowledgeConstellation = () => {
  const {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleFitToScreen,
    selectedSkillId,
    setSelectedSkillId,
    selectedSkillObj,
    activeDrawerTab,
    setActiveDrawerTab,
    graphData
  } = useKnowledgeGraph();

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <ConstellationCanvas
        graphData={graphData}
        selectedSkillId={selectedSkillId}
        onSelectSkill={(id) => { setSelectedSkillId(id); setActiveDrawerTab('overview'); }}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitToScreen={handleFitToScreen}
      />

      <SkillDetailsDrawer
        skill={selectedSkillObj}
        isOpen={!!selectedSkillId}
        onClose={() => setSelectedSkillId(null)}
        activeTab={activeDrawerTab}
        onTabChange={setActiveDrawerTab}
        onAskSage={(s) => alert(`Ask Sage AI about ${s?.name}`)}
        onStartPractice={(s) => alert(`Starting practice for ${s?.name}`)}
        onAddToPlanner={(s) => alert(`Added ${s?.name} to Study Planner`)}
      />
    </div>
  );
};

export default KnowledgeConstellation;

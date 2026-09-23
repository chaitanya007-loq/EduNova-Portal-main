import React, { useState } from 'react';
import { useKnowledgeGraph } from '../../hooks/useKnowledgeGraph';

import { ConstellationHeader } from '../../components/knowledge/ConstellationHeader';
import { SkillKPICards } from '../../components/knowledge/SkillKPICards';
import { ConstellationCanvas } from '../../components/knowledge/ConstellationCanvas';
import { NextBestSkillCard } from '../../components/knowledge/NextBestSkillCard';
import { CareerSkillMap } from '../../components/knowledge/CareerSkillMap';
import { SkillPathView } from '../../components/knowledge/SkillPathView';
import { WeakSkillsRadar } from '../../components/knowledge/WeakSkillsRadar';
import { SageSkillInsight } from '../../components/knowledge/SageSkillInsight';
import { SkillDetailsDrawer } from '../../components/knowledge/SkillDetailsDrawer';
import { SkillCommandPalette } from '../../components/knowledge/SkillCommandPalette';
import { DailySkillChallenge } from '../../components/knowledge/DailySkillChallenge';

// Interactive Action Modals
import { SkillPracticeModal } from '../../components/knowledge/SkillPracticeModal';
import { AddToPlannerModal } from '../../components/knowledge/AddToPlannerModal';
import { AddSkillNodeModal } from '../../components/knowledge/AddSkillNodeModal';

export const KnowledgeConstellationPage = () => {
  const {
    viewMode,
    setViewMode,
    educationContext,
    setEducationContext,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedCareerId,
    setSelectedCareerId,
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
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isAddNodeModalOpen,
    setIsAddNodeModalOpen,
    handleAddNode,
    handleUpdateSkillMastery,
    handleLoadDefaultCurriculum,
    handleResetConstellation,
    graphData,
    kpiData,
    careerCoverageData,
    nextBestSkillData,
    weakSkills,
    strongSkills,
    sageInsight
  } = useKnowledgeGraph();

  // Modals state for buttons
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [activeSkillTarget, setActiveSkillTarget] = useState(null);

  const handleAction = (type, targetObj) => {
    const target = targetObj || selectedSkillObj || nextBestSkillData?.skill || { name: 'React Architecture' };
    setActiveSkillTarget(target);

    if (type === 'start' || type === 'practice') {
      setIsPracticeOpen(true);
    } else if (type === 'planner') {
      setIsPlannerOpen(true);
    } else if (type === 'sage') {
      if (target.id) setSelectedSkillId(target.id);
      setActiveDrawerTab('advice');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* 1. HERO HEADER & VIEW MODE CONTROLS */}
      <ConstellationHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        educationContext={educationContext}
        onEducationContextChange={setEducationContext}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={graphData?.categories || []}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAddModal={() => setIsAddNodeModalOpen(true)}
        onOpenSageChat={() => {
          if (selectedSkillId) setActiveDrawerTab('advice');
          else if (graphData?.nodes?.[0]?.id) {
            setSelectedSkillId(graphData.nodes[0].id);
            setActiveDrawerTab('advice');
          }
        }}
      />

      {/* 2. PRIMARY VIEW MODE CONTENT (Switches dynamically on tab click) */}
      {viewMode === 'constellation' && (
        <ConstellationCanvas
          graphData={graphData}
          selectedSkillId={selectedSkillId}
          onSelectSkill={(id) => { setSelectedSkillId(id); setActiveDrawerTab('overview'); }}
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onFitToScreen={handleFitToScreen}
          onOpenAddModal={() => setIsAddNodeModalOpen(true)}
          onLoadDefaultCurriculum={handleLoadDefaultCurriculum}
          educationContext={educationContext}
        />
      )}

      {(viewMode === 'path' || viewMode === 'tree' || viewMode === 'dependency') && (
        <SkillPathView
          nodes={graphData?.nodes || []}
          onSelectSkill={(id) => { setSelectedSkillId(id); setActiveDrawerTab('overview'); }}
          viewMode={viewMode}
        />
      )}

      {viewMode === 'career' && (
        <CareerSkillMap
          selectedCareerId={selectedCareerId}
          onSelectCareer={setSelectedCareerId}
          careerData={careerCoverageData}
          onSelectSkill={(id) => { setSelectedSkillId(id); setActiveDrawerTab('overview'); }}
        />
      )}

      {/* 3. DYNAMIC SAGE AI CONSTELLATION INSIGHT */}
      <SageSkillInsight
        insightText={sageInsight}
        onStartRecommended={() => handleAction('start', nextBestSkillData?.skill)}
      />

      {/* 4. LEARNING UNIVERSE OVERVIEW (6 KPI Cards) */}
      <SkillKPICards kpiData={kpiData} />

      {/* 5. HIGHLIGHTED NEXT BEST SKILL RECOMMENDATION */}
      {nextBestSkillData && (
        <NextBestSkillCard
          recommendationData={nextBestSkillData}
          onAction={handleAction}
        />
      )}

      {/* 6. DAILY SKILL CHALLENGE (+50 XP) */}
      <DailySkillChallenge onStartChallenge={() => handleAction('practice', { name: 'Daily Skill Challenge' })} />

      {/* 7. WEAK SKILLS RADAR & STRONGEST SKILLS */}
      <WeakSkillsRadar
        weakSkills={weakSkills}
        strongSkills={strongSkills}
        onSelectSkill={(id) => { setSelectedSkillId(id); setActiveDrawerTab('overview'); }}
        onAskSage={(s) => handleAction('sage', s)}
      />

      {/* DRAWERS & ACTION MODALS */}
      <SkillDetailsDrawer
        skill={selectedSkillObj}
        isOpen={!!selectedSkillId}
        onClose={() => setSelectedSkillId(null)}
        activeTab={activeDrawerTab}
        onTabChange={setActiveDrawerTab}
        onAskSage={(s) => handleAction('sage', s)}
        onStartPractice={(s) => handleAction('practice', s)}
        onAddToPlanner={(s) => handleAction('planner', s)}
      />

      <SkillCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectSkill={(id) => { setSelectedSkillId(id); setActiveDrawerTab('overview'); }}
        onViewModeChange={setViewMode}
      />

      <AddSkillNodeModal
        isOpen={isAddNodeModalOpen}
        onClose={() => setIsAddNodeModalOpen(false)}
        onAddNode={handleAddNode}
        existingNodes={graphData?.nodes || []}
        categories={graphData?.categories || []}
      />

      {/* INTERACTIVE PRACTICE & PLANNER MODALS */}
      <SkillPracticeModal
        isOpen={isPracticeOpen}
        onClose={() => setIsPracticeOpen(false)}
        skillObj={activeSkillTarget}
        onComplete={(res) => {
          const targetId = activeSkillTarget?.id || selectedSkillId;
          const pct = typeof res === 'object' ? res.percentage : Math.round((Number(res || 3) / 3) * 100);
          if (targetId && handleUpdateSkillMastery) {
            handleUpdateSkillMastery(targetId, pct);
          }
        }}
      />

      <AddToPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        skillObj={activeSkillTarget}
      />
    </div>
  );
};

export default KnowledgeConstellationPage;

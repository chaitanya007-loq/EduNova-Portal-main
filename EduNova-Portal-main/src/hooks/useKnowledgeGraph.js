import { useState, useEffect, useCallback } from 'react';
import { useLearner } from '../context/LearnerContext';
import { skillGraphService } from '../services/skillGraphService';
import { getEducationContext } from '../services/educationContextService';

export const useKnowledgeGraph = () => {
  const { learner, learnerType: contextType } = useLearner();

  // Get current active dashboard education type (school, college, exam, skills)
  const activeEduType = getEducationContext()?.educationType || contextType || 'college';

  // Graph state
  const [viewMode, setViewMode] = useState('constellation'); // 'constellation' | 'path' | 'tree' | 'dependency' | 'career'
  const [educationContext, setEducationContext] = useState(activeEduType);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState('fullstack');
  const [refreshTick, setRefreshTick] = useState(0);

  // Canvas zoom & pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Modals state
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState('overview');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);

  // Sync education context from global dashboard service or contextType
  useEffect(() => {
    const currentType = getEducationContext()?.educationType || contextType;
    if (currentType && currentType !== educationContext) {
      setEducationContext(currentType);
    }
  }, [contextType]);

  // Global Keyboard Listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch graph data using current educationContext & refreshTick
  const graphData = skillGraphService.getGraphData(educationContext, selectedCategory, searchQuery);
  const kpiData = skillGraphService.getKPICardsData(educationContext);
  const careerCoverageData = skillGraphService.getCareerGoalCoverage(selectedCareerId, educationContext);
  const nextBestSkillData = skillGraphService.getNextBestSkill(educationContext);
  const weakSkills = skillGraphService.getWeakSkills(educationContext);
  const strongSkills = skillGraphService.getStrongSkills(educationContext);
  const sageInsight = skillGraphService.getSageSkillInsight(selectedSkillId, educationContext);
  const selectedSkillObj = selectedSkillId ? skillGraphService.getSkillById(selectedSkillId, educationContext) : null;

  // Add Custom Skill Node
  const handleAddNode = (nodeData) => {
    const { newNode } = skillGraphService.addCustomSkillNode(educationContext, nodeData);
    if (newNode) {
      setSelectedSkillId(newNode.id);
      setActiveDrawerTab('overview');
    }
    setRefreshTick(t => t + 1);
  };

  // Update Skill Mastery (e.g. after quiz or diagnostic)
  const handleUpdateSkillMastery = (skillId, score, customEvidence) => {
    skillGraphService.updateSkillMastery(educationContext, skillId, score, customEvidence);
    setRefreshTick(t => t + 1);
  };

  // Load Default Curriculum
  const handleLoadDefaultCurriculum = () => {
    skillGraphService.initializeDefaultCurriculum(educationContext);
    setRefreshTick(t => t + 1);
  };

  // Reset Constellation
  const handleResetConstellation = () => {
    skillGraphService.resetConstellation(educationContext);
    setSelectedSkillId(null);
    setRefreshTick(t => t + 1);
  };

  // Canvas Control Handlers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(2.0, Math.round((prev + 0.15) * 100) / 100));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.5, Math.round((prev - 0.15) * 100) / 100));
  const handleResetZoom = () => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); };
  const handleFitToScreen = () => { setZoomLevel(0.9); setPanOffset({ x: 0, y: 0 }); };

  return {
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
    panOffset,
    setPanOffset,
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
    isNewUser: graphData.nodes.length === 0,
    graphData,
    kpiData,
    careerCoverageData,
    nextBestSkillData,
    weakSkills,
    strongSkills,
    sageInsight,
    learner
  };
};


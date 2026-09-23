// EduNova Skill DNA React Hook
import { useState, useEffect, useCallback } from 'react';
import { skillDNAService } from '../services/skillDNAService';

export const useSkillDNA = () => {
  const [skillDNA, setSkillDNA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGoal, setActiveGoal] = useState('Become a Full Stack Developer');
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  const fetchSkillDNA = useCallback(() => {
    setLoading(true);
    const data = skillDNAService.getSkillDNA();
    const gap = skillDNAService.generateSkillGapAnalysis(activeGoal);
    const rmap = skillDNAService.generateLearningRoadmap(activeGoal);

    setSkillDNA(data);
    setGapAnalysis(gap);
    setRoadmap(rmap);
    setLoading(false);
  }, [activeGoal]);

  useEffect(() => {
    fetchSkillDNA();
  }, [fetchSkillDNA]);

  const updateGoal = (newGoal) => {
    setActiveGoal(newGoal);
    setGapAnalysis(skillDNAService.generateSkillGapAnalysis(newGoal));
    setRoadmap(skillDNAService.generateLearningRoadmap(newGoal));
  };

  const refreshAnalysis = () => {
    fetchSkillDNA();
  };

  return {
    skillDNA,
    loading,
    activeGoal,
    gapAnalysis,
    roadmap,
    updateGoal,
    refreshAnalysis
  };
};

export default useSkillDNA;

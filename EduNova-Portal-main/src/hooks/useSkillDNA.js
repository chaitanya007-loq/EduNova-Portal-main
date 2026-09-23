// EduNova Skill DNA React Hook
import { useState, useEffect, useCallback } from 'react';
import { skillDNAService } from '../services/skillDNAService';

export const useSkillDNA = () => {
  const [skillDNA, setSkillDNA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGoal, setActiveGoal] = useState('Become a Full Stack Developer');
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState(null);

  const fetchSkillDNA = useCallback(async () => {
    setLoading(true);
    const [data, gap, rmap] = await Promise.all([
      skillDNAService.getSkillDNA(),
      skillDNAService.generateSkillGapAnalysis(activeGoal),
      skillDNAService.generateLearningRoadmap(activeGoal),
    ]);

    setSkillDNA(data);
    setGapAnalysis(gap);
    setRoadmap(rmap);
    setLoading(false);
  }, [activeGoal]);

  useEffect(() => {
    fetchSkillDNA();
  }, [fetchSkillDNA]);

  const updateGoal = async (newGoal) => {
    setActiveGoal(newGoal);
    const [gap, rmap] = await Promise.all([
      skillDNAService.generateSkillGapAnalysis(newGoal),
      skillDNAService.generateLearningRoadmap(newGoal),
    ]);
    setGapAnalysis(gap);
    setRoadmap(rmap);
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

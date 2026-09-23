import apiClient from '../lib/apiClient';

export const SKILL_CATEGORIES = [
  'Problem Solving',
  'Programming',
  'Mathematics',
  'Communication',
];

const emptyState = 'Take a Skill Assessment or complete lessons to map your Skill DNA.';

class SkillDNAService {
  async getSkillDNA() {
    const response = await apiClient.get('/skills/dna');
    const data = response.data || {};
    if (data.totalLogs === 0) {
      return { ...data, emptyState: data.emptyState || emptyState, skills: [] };
    }

    return {
      ...data,
      skills: Object.entries(data.categories || {}).map(([key, score]) => ({
        skill: key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase()),
        score,
        evidenceCount: data.totalLogs,
      })),
    };
  }

  async generateSkillGapAnalysis() {
    return { targetGoal: 'Evidence-based Skill DNA', matchPercentage: 0, acquiredSkills: [], missingSkills: [], actionPlan: [] };
  }

  async generateLearningRoadmap() {
    return { title: 'Learning Roadmap', phases: [] };
  }

  logWrongAnswer() {}

  addEvidence() {}
}

export const skillDNAService = new SkillDNAService();
export const addEvidence = (category, evidence) => skillDNAService.addEvidence(category, evidence);
export default skillDNAService;

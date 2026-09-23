/**
 * EduNova Skills & Career Track Service
 * Interactive Skill Roadmaps & Evidence-Based Skill Gap Analysis.
 */

export const getSkillRoadmap = () => {
  return {
    targetRole: 'FULL STACK DEVELOPER',
    nodes: [
      { id: 'n1', title: 'JavaScript & ES6+', status: 'Completed', xp: 450, icon: '⚡' },
      { id: 'n2', title: 'React UI Architecture', status: 'Completed', xp: 600, icon: '⚛️' },
      { id: 'n3', title: 'Node.js & Express REST APIs', status: 'In Progress', xp: 350, icon: '🟢' },
      { id: 'n4', title: 'PostgreSQL & ORM Schema', status: 'Next', xp: 400, icon: '🐘' },
      { id: 'n5', title: 'System Design & Redis Caching', status: 'Locked', xp: 500, icon: '🏗️' },
      { id: 'n6', title: 'Full Stack Production Deployment', status: 'Locked', xp: 700, icon: '🚀' }
    ]
  };
};

export const getSkillGapAnalysis = () => {
  return {
    targetRole: 'Frontend & UI Systems Developer',
    matchedPercent: 82,
    skills: [
      { name: 'JavaScript & Modern Web APIs', status: 'Strong', score: 92, evidence: '4 Quiz Masteries & 3 Labs' },
      { name: 'React Component Design', status: 'Strong', score: 95, evidence: 'Verified via EduNova Visualizer Project' },
      { name: 'TypeScript & Type Systems', status: 'Developing', score: 68, evidence: '2 Lessons Completed' },
      { name: 'CSS Architecture & Glassmorphism', status: 'Strong', score: 90, evidence: 'UI Practice Projects' },
      { name: 'State Management (Redux / Context)', status: 'Developing', score: 72, evidence: 'Study Session Activity' },
      { name: 'Web Performance Optimization', status: 'Needs Learning', score: 45, evidence: 'No practice logged yet' }
    ]
  };
};

export default {
  getSkillRoadmap,
  getSkillGapAnalysis
};

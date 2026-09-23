/**
 * EduNova Exam Preparation & Mock Intelligence Service
 * Manages syllabus command center, mock test analytics, and error taxonomy intelligence.
 */

export const getExamSyllabusData = () => {
  return {
    examName: 'JEE Advanced 2026',
    daysRemaining: 184,
    totalTopics: 100,
    completedTopics: 72,
    inRevisionTopics: 18,
    remainingTopics: 10,
    masteredTopics: 45,
    subjectBreakdown: [
      { subject: 'Physics', completed: 25, total: 32, progress: 78, nextTopic: 'Electromagnetism & Waves' },
      { subject: 'Chemistry', completed: 24, total: 34, progress: 70, nextTopic: 'Organic Reaction Mechanisms' },
      { subject: 'Mathematics', completed: 23, total: 34, progress: 67, nextTopic: 'Definite Integrals & Differential Eqs' }
    ]
  };
};

export const getMockTestIntelligence = () => {
  return {
    recentMockScore: '248 / 300',
    overallAccuracy: '82%',
    avgTimePerQuestion: '1m 45s',
    attemptRate: '94%',
    scoreTrend: [
      { test: 'Mock 1', score: 210, accuracy: 74 },
      { test: 'Mock 2', score: 225, accuracy: 78 },
      { test: 'Mock 3', score: 238, accuracy: 80 },
      { test: 'Mock 4', score: 248, accuracy: 82 }
    ]
  };
};

export const getErrorIntelligence = () => {
  return [
    { category: 'Conceptual Error', count: 5, color: '#f43f5e', description: 'Misunderstood physical law or mathematical property', action: 'Ask Sage AI to Re-explain' },
    { category: 'Calculation Mistake', count: 8, color: '#f59e0b', description: 'Sign or arithmetic error during multi-step derivation', action: 'Practice Step-by-Step' },
    { category: 'Misread Question', count: 3, color: '#06b6d4', description: 'Overlooked specific constraints or given units', action: 'Add to Revision Checklist' },
    { category: 'Forgotten Formula', count: 4, color: '#a855f7', description: 'Stalled due to key identity or constant value', action: 'Flashcard Drill' },
    { category: 'Time Pressure Rush', count: 6, color: '#6366f1', description: 'Guessed under last 10-minute timer constraint', action: 'Speed Practice Drill' }
  ];
};

export default {
  getExamSyllabusData,
  getMockTestIntelligence,
  getErrorIntelligence
};

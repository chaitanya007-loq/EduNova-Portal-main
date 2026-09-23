// EduNova Intelligent Context Selector & Builder
// Assembles relevant learner context (profile, education, subject, material, quiz history) without sending unnecessary data

import { getStoredLearnerProfile } from '../../data/learners';
import { subjectService } from '../subjectService';
import { quizService } from '../quizService';
import { materialService } from '../materialService';

/**
 * Builds context tailored for an AI request.
 * @param {Object} options - Request context options
 * @returns {Object} Filtered context object
 */
export const buildAIContext = (options = {}) => {
  const {
    activeSubjectId = null,
    activeTopic = null,
    userPrompt = '',
    includeMaterials = false
  } = options;

  const profile = getStoredLearnerProfile() || {};
  const lowerPrompt = (userPrompt || '').toLowerCase();

  // If simple greeting or non-academic query, attach only basic name
  const isCasual = lowerPrompt === 'hi' || lowerPrompt === 'hello' || lowerPrompt === 'how are you';
  if (isCasual) {
    return {
      learnerProfile: {
        name: profile.name || 'Learner'
      }
    };
  }

  // Retrieve current subject data if available
  let currentSubject = null;
  if (activeSubjectId) {
    currentSubject = subjectService.getSubjectById(activeSubjectId);
  }

  // Retrieve relevant material excerpts if requested
  let relevantMaterial = null;
  if (includeMaterials || activeSubjectId) {
    const materials = materialService.getMaterialsBySubject ? materialService.getMaterialsBySubject(activeSubjectId) : [];
    if (materials && materials.length > 0) {
      relevantMaterial = materials[0].description || materials[0].title || null;
    }
  }

  // Retrieve recent quiz history for topic mastery signals
  const quizHistory = quizService.getQuizHistory ? quizService.getQuizHistory(activeSubjectId) || [] : [];

  return {
    learnerProfile: {
      name: profile.name || 'Learner',
      educationType: profile.learnerType || 'school',
      title: profile.title || 'Student',
      degree: profile.degree || 'B.Tech',
      branch: profile.branch || 'Computer Science',
      class: profile.class || 'Class 10',
      weakTopics: profile.weakTopics || [],
      strongTopics: profile.strongTopics || []
    },
    currentSubject: currentSubject ? {
      id: currentSubject.id,
      name: currentSubject.name,
      code: currentSubject.code,
      chapter: currentSubject.currentChapter
    } : null,
    currentTopic: activeTopic || (currentSubject ? currentSubject.weakTopic : null),
    relevantMaterial: relevantMaterial,
    recentQuizResults: quizHistory.slice(0, 3).map(q => ({
      topic: q.topicName || q.topic,
      score: q.percentage ? `${q.percentage}%` : 'N/A'
    }))
  };
};

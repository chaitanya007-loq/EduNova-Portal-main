import { getStoredLearnerProfile } from '../../data/learners';
import { subjectService } from '../subjectService';
import { quizService } from '../quizService';
import { skillGraphService } from '../skillGraphService';
import { studyPlannerService } from '../studyPlannerService';
import { INTENT_TYPES } from './intentClassifier';

export const buildLearnerContext = (activeSubjectId = null, activeTopicId = null) => {
  const profile = getStoredLearnerProfile() || {};
  const track = (profile.learnerType || 'school').toLowerCase();
  
  let currentSubject = null;
  if (activeSubjectId) {
    currentSubject = subjectService.getSubjectById(activeSubjectId);
  }

  // Get all active track subjects & progress
  const selectedSubjects = subjectService.getSelectedSubjects(track) || [];
  const subjectSummaries = selectedSubjects.map(s => ({
    id: s.id,
    name: s.name,
    progress: s.progress || 0,
    targetScore: s.targetScore || 90,
    currentTopic: s.currentTopic || s.weakTopic || '',
    weakTopic: s.weakTopic || ''
  }));

  // Get Knowledge Constellation stats
  const kpiData = skillGraphService.getKPICardsData(track);
  const constellationNodes = skillGraphService.getSkillsForContext(track) || [];
  const graphSummary = {
    totalNodes: kpiData.totalNodes,
    masteredCount: kpiData.masteredCount,
    overallProgress: kpiData.overallProgress,
    weakSkills: constellationNodes.filter(n => n.status === 'NEEDS_REVIEW' || (n.masteryScore > 0 && n.masteryScore < 60)).map(n => n.name)
  };

  // Get Study Planner state
  const studySessions = studyPlannerService.getSessions ? studyPlannerService.getSessions() : [];
  const currentPlan = studyPlannerService.getCurrentPlan ? studyPlannerService.getCurrentPlan() : null;

  const quizHistory = quizService.getQuizHistory(activeSubjectId) || [];
  const profileWeakTopics = Array.isArray(profile.weakTopics) ? profile.weakTopics : [];
  const subjectWeakTopics = selectedSubjects.map(s => s.weakTopic).filter(Boolean);
  const combinedWeakTopics = Array.from(new Set([...profileWeakTopics, ...subjectWeakTopics, ...graphSummary.weakSkills]));

  return {
    userId: profile.id || 'user_guest',
    name: profile.name || 'Learner',
    username: profile.username || 'learner',
    learnerType: track,
    title: profile.title || `${track.toUpperCase()} Learner`,
    bio: profile.bio || '',
    level: profile.level || 1,
    xp: profile.xp || 0,
    streakDays: profile.streakDays || 0,
    
    // Education Context Details
    education: {
      class: profile.education?.class || profile.class || 'Class 10',
      board: profile.board || profile.education?.board || 'CBSE',
      degree: profile.degree || profile.education?.degree || 'B.Tech',
      branch: profile.branch || profile.education?.branch || 'Computer Science',
      semester: profile.semester || profile.education?.semester || 'Semester 4',
      examName: profile.education?.examName || profile.exam || 'JEE Main / CMAT',
      targetYear: profile.education?.targetYear || '2026',
      careerDomain: profile.education?.careerDomain || 'STEM & Tech'
    },
    
    // Goals & Weak Topics
    goals: profile.goals || [],
    weakTopics: combinedWeakTopics,
    
    // Full Website Data
    enrolledSubjects: subjectSummaries,
    currentSubject: currentSubject ? currentSubject.name : (selectedSubjects[0]?.name || null),
    currentChapter: currentSubject ? currentSubject.currentChapter : null,
    currentTopic: activeTopicId || currentSubject?.weakTopic || selectedSubjects[0]?.currentTopic || null,
    
    // Constellation & Planner Summary
    graphSummary,
    studyPlanner: {
      activeMode: studyPlannerService.getPlannerMode ? studyPlannerService.getPlannerMode() : 'Adaptive AI',
      totalSessions: studySessions.length,
      planTitle: currentPlan?.title || 'Personalized Study Plan'
    },

    // Quiz History
    recentQuizResults: quizHistory.slice(0, 3).map(q => ({ topic: q.topicName || q.topic, score: `${q.percentage || 0}%` })),

    // Whole Website Navigation & Module Registry
    websiteModules: {
      subjects: { path: '/my-subjects', label: 'My Subjects & Syllabus' },
      constellation: { path: '/constellation', label: 'Knowledge Constellation 3D Skill Graph' },
      studyPlanner: { path: '/study-planner', label: 'AI Adaptive Study Planner' },
      quizzes: { path: '/quizzes', label: 'Interactive Diagnostics & Quizzes' },
      xrStudio: { path: '/xr-studio', label: '3D AR/VR Immersive Science & Engineering Labs' },
      skillExchange: { path: '/marketplace', label: 'Peer Skill Exchange & Mentorship' },
      notes: { path: '/notes', label: 'Notes & Active Recall Flashcards' },
      profile: { path: '/profile', label: 'My Learner Profile' }
    }
  };
};

/**
 * Filter out irrelevant context so Sage AI only receives domain-pertinent learner details
 */
export const filterRelevantContext = (fullContext, intentType, promptText = '') => {
  // If casual, greeting, or general conversation -> basic greeting context
  if (
    intentType === INTENT_TYPES.GREETING || 
    intentType === INTENT_TYPES.CASUAL_CONVERSATION
  ) {
    return {
      name: fullContext.name,
      learnerType: fullContext.learnerType,
      isCasual: true
    };
  }

  return {
    ...fullContext,
    isCasual: false
  };
};

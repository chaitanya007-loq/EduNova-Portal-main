/**
 * Lab Progress Service for EduNova Immersive Learning Platform.
 * Tracks lab completions, attempts, accuracy, streak, and emits evidence to Skill DNA.
 */

import { addEvidence } from './skillDNAService';

const PROGRESS_STORAGE_KEY = 'edunova_lab_progress';
const ATTEMPTS_STORAGE_KEY = 'edunova_lab_attempts';

/**
 * Get user progress overview (completed labs count, mastery, XP, streak)
 */
export const getLabProgress = () => {
  try {
    const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load lab progress', e);
  }

  // Default empty state for new user - NO fake numbers
  return {
    completedLabs: [],
    totalAttempts: 0,
    totalTimeSpentMins: 0,
    totalXP: 0,
    streakDays: 1,
    subjectMastery: {},
    lastExperiment: null
  };
};

/**
 * Get attempt history for a specific lab or overall
 */
export const getLabAttempts = (labId = null) => {
  try {
    const data = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    const attempts = data ? JSON.parse(data) : [];
    if (labId) {
      return attempts.filter((a) => a.labId === labId);
    }
    return attempts;
  } catch (e) {
    console.warn('Failed to load lab attempts', e);
    return [];
  }
};

/**
 * Record a completed lab attempt or experiment run.
 * Automatically emits evidence to Skill DNA and updates subject mastery.
 */
export const recordLabAttempt = ({ labId, labTitle, subject, parameters, results, score = 90, timeSpentMins = 10, notes = '' }) => {
  const currentProgress = getLabProgress();
  const attempts = getLabAttempts();

  const attemptObj = {
    id: `attempt_${Date.now()}`,
    labId,
    labTitle,
    subject,
    parameters,
    results,
    score,
    timeSpentMins,
    notes,
    timestamp: new Date().toISOString()
  };

  // Add to attempts log
  attempts.unshift(attemptObj);
  localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts.slice(0, 100)));

  // Update progress overview
  const isNewCompletion = !currentProgress.completedLabs.includes(labId);
  const updatedCompleted = isNewCompletion ? [...currentProgress.completedLabs, labId] : currentProgress.completedLabs;
  
  // Calculate new XP
  const xpEarned = isNewCompletion ? 150 : 50;
  const newXP = (currentProgress.totalXP || 0) + xpEarned;

  // Update subject mastery
  const currentSubjectScore = currentProgress.subjectMastery[subject] || 0;
  const newSubjectScore = Math.min(100, Math.round((currentSubjectScore * 0.6) + (score * 0.4)));
  const updatedMastery = {
    ...currentProgress.subjectMastery,
    [subject]: newSubjectScore
  };

  const updatedProgress = {
    ...currentProgress,
    completedLabs: updatedCompleted,
    totalAttempts: (currentProgress.totalAttempts || 0) + 1,
    totalTimeSpentMins: (currentProgress.totalTimeSpentMins || 0) + timeSpentMins,
    totalXP: newXP,
    subjectMastery: updatedMastery,
    lastExperiment: {
      labId,
      labTitle,
      subject,
      timestamp: new Date().toISOString()
    }
  };

  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updatedProgress));

  // --- EMIT REAL EVIDENCE TO SKILL DNA ---
  try {
    let skillCategory = 'PROBLEM_SOLVING';
    if (subject.includes('CS') || subject.includes('Data Structures') || subject.includes('Full Stack')) {
      skillCategory = 'PROGRAMMING';
    } else if (subject.includes('Physics') || subject.includes('Chemistry') || subject.includes('Biology')) {
      skillCategory = 'PROBLEM_SOLVING';
    } else if (subject.includes('Mathematics') || subject.includes('AI')) {
      skillCategory = 'MATHEMATICS_ML';
    } else if (subject.includes('Networks') || subject.includes('DBMS') || subject.includes('Operating Systems')) {
      skillCategory = 'SYSTEM_DESIGN';
    }

    addEvidence(skillCategory, {
      type: 'LAB_SIMULATION',
      description: `Completed Immersive Lab: ${labTitle}`,
      score: score,
      labId,
      timeSpentMins
    });
  } catch (err) {
    console.warn('Skill DNA evidence emission warning:', err);
  }

  return {
    progress: updatedProgress,
    attempt: attemptObj,
    xpEarned
  };
};

export default {
  getLabProgress,
  getLabAttempts,
  recordLabAttempt
};

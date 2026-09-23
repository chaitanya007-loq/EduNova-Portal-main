/**
 * EduNova User Progress & Gauge Service
 * Provides isolated, dynamic progress tracking per user ID.
 * Fresh users start at 0% across Learning, Practice, Assignments, Attendance.
 * Dynamic actions increment progress persistently in localStorage & sync via window events.
 */

const STORAGE_PREFIX = 'edunova_user_progress_';

const DEFAULT_PROGRESS = {
  learning: 0,
  practice: 0,
  assignments: 0,
  attendance: 0,
  completedLessons: 0,
  totalLessons: 10,
  completedQuizzes: 0,
  quizTotalScoreSum: 0,
  completedAssignments: 0,
  totalAssignments: 5,
  activeDays: 0,
  studyMinutes: 0,
  achievementsUnlocked: 0,
  lastUpdated: null,
};

class UserProgressService {
  getStorageKey(userId) {
    const cleanId = userId || 'guest';
    return `${STORAGE_PREFIX}${cleanId}`;
  }

  /**
   * Fetch current user's progress. Defaults to 0 for new accounts.
   */
  getUserProgress(userId) {
    if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
    try {
      const key = this.getStorageKey(userId);
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PROGRESS, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load user progress:', e);
    }
    return { ...DEFAULT_PROGRESS };
  }

  /**
   * Save progress for given user and dispatch event for live UI update.
   */
  saveUserProgress(userId, progressData) {
    if (typeof window === 'undefined') return progressData;
    try {
      const key = this.getStorageKey(userId);
      const updated = {
        ...progressData,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('edunova_progress_updated', { detail: { userId, progress: updated } }));
      return updated;
    } catch (e) {
      console.error('Failed to save user progress:', e);
      return progressData;
    }
  }

  /**
   * Reset user progress to 0% (Fresh start baseline)
   */
  resetUserProgress(userId) {
    return this.saveUserProgress(userId, { ...DEFAULT_PROGRESS });
  }

  /**
   * Record learning activity (lesson completed / topic studied)
   */
  recordLearningActivity(userId, { incrementPercent = 15, minutes = 15 } = {}) {
    const current = this.getUserProgress(userId);
    const newCompleted = current.completedLessons + 1;
    const computedLearning = Math.min(100, Math.max(current.learning + incrementPercent, Math.round((newCompleted / current.totalLessons) * 100)));
    const newStudyMinutes = (current.studyMinutes || 0) + minutes;
    const achievements = Math.max(current.achievementsUnlocked, newCompleted >= 1 ? 1 : 0);

    return this.saveUserProgress(userId, {
      ...current,
      completedLessons: newCompleted,
      learning: computedLearning,
      studyMinutes: newStudyMinutes,
      achievementsUnlocked: achievements
    });
  }

  /**
   * Record practice quiz score
   */
  recordPracticeQuiz(userId, { scorePercentage = 100, minutes = 20 } = {}) {
    const current = this.getUserProgress(userId);
    const newQuizzes = current.completedQuizzes + 1;
    const newScoreSum = current.quizTotalScoreSum + scorePercentage;
    const avgScore = Math.round(newScoreSum / newQuizzes);
    const computedPractice = Math.min(100, Math.round((newQuizzes * 20 * 0.4) + (avgScore * 0.6)));
    const newStudyMinutes = (current.studyMinutes || 0) + minutes;
    const achievements = Math.max(current.achievementsUnlocked, newQuizzes >= 1 ? 2 : 1);

    return this.saveUserProgress(userId, {
      ...current,
      completedQuizzes: newQuizzes,
      quizTotalScoreSum: newScoreSum,
      practice: computedPractice,
      studyMinutes: newStudyMinutes,
      achievementsUnlocked: achievements
    });
  }

  /**
   * Record assignment completion
   */
  recordAssignmentCompleted(userId, { incrementPercent = 25, minutes = 30 } = {}) {
    const current = this.getUserProgress(userId);
    const newCompleted = current.completedAssignments + 1;
    const computedAssignments = Math.min(100, Math.max(current.assignments + incrementPercent, Math.round((newCompleted / current.totalAssignments) * 100)));
    const newStudyMinutes = (current.studyMinutes || 0) + minutes;
    const achievements = Math.max(current.achievementsUnlocked, newCompleted >= 1 ? 3 : 2);

    return this.saveUserProgress(userId, {
      ...current,
      completedAssignments: newCompleted,
      assignments: computedAssignments,
      studyMinutes: newStudyMinutes,
      achievementsUnlocked: achievements
    });
  }

  /**
   * Record attendance / daily active check-in
   */
  recordAttendance(userId, streakDays = 0) {
    const current = this.getUserProgress(userId);
    const activeDays = Math.max(current.activeDays, streakDays || (current.activeDays + 1));
    const computedAttendance = activeDays > 0 ? Math.min(100, Math.round(activeDays * 20 + 20)) : 0;

    return this.saveUserProgress(userId, {
      ...current,
      activeDays,
      attendance: computedAttendance,
    });
  }
}

export const progressService = new UserProgressService();
export default progressService;

export const getPersonalizedLearningPath = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return null;
};

export const markPathNodeCompleted = async (nodeId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return null;
};

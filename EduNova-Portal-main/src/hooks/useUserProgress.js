import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services/progressService';

export const useUserProgress = () => {
  const { user } = useAuth() || {};
  const userId = user?.id || user?.email || user?.studentUsername || 'guest';

  const [progress, setProgress] = useState(() => progressService.getUserProgress(userId));

  // Sync state when userId changes
  useEffect(() => {
    setProgress(progressService.getUserProgress(userId));
  }, [userId]);

  // Listen for global custom event updates
  useEffect(() => {
    const handleProgressUpdate = (e) => {
      if (!e.detail || e.detail.userId === userId || e.detail.userId === 'guest') {
        setProgress(progressService.getUserProgress(userId));
      }
    };

    window.addEventListener('edunova_progress_updated', handleProgressUpdate);
    return () => {
      window.removeEventListener('edunova_progress_updated', handleProgressUpdate);
    };
  }, [userId]);

  const recordLearning = useCallback((incrementPercent = 15) => {
    const updated = progressService.recordLearningActivity(userId, { incrementPercent });
    setProgress(updated);
    return updated;
  }, [userId]);

  const recordPractice = useCallback((scorePercentage = 100) => {
    const updated = progressService.recordPracticeQuiz(userId, { scorePercentage });
    setProgress(updated);
    return updated;
  }, [userId]);

  const recordAssignment = useCallback((incrementPercent = 25) => {
    const updated = progressService.recordAssignmentCompleted(userId, { incrementPercent });
    setProgress(updated);
    return updated;
  }, [userId]);

  const recordAttendance = useCallback((streakDays = 0) => {
    const updated = progressService.recordAttendance(userId, streakDays);
    setProgress(updated);
    return updated;
  }, [userId]);

  const resetProgress = useCallback(() => {
    const reset = progressService.resetUserProgress(userId);
    setProgress(reset);
    return reset;
  }, [userId]);

  return {
    progress,
    learning: progress.learning || 0,
    practice: progress.practice || 0,
    assignments: progress.assignments || 0,
    attendance: progress.attendance || 0,
    completedLessons: progress.completedLessons || 0,
    completedQuizzes: progress.completedQuizzes || 0,
    completedAssignments: progress.completedAssignments || 0,
    recordLearning,
    recordPractice,
    recordAssignment,
    recordAttendance,
    resetProgress,
  };
};

export default useUserProgress;

/**
 * EduNova Achievement Rule Engine
 * Evaluates learning events against achievement conditions.
 */
export const checkAchievementRules = (userStats, currentAchievements) => {
  const updatedAchievements = currentAchievements.map((ach) => {
    if (ach.unlocked) return ach;

    let currentVal = 0;
    switch (ach.conditionType) {
      case 'PERFECT_QUIZZES':
        currentVal = userStats.perfectQuizzes || 0;
        break;
      case 'LESSONS_COMPLETED':
        currentVal = userStats.lessonsCompleted || 0;
        break;
      case 'QUIZZES_COMPLETED':
        currentVal = userStats.quizzesCompleted || 0;
        break;
      case 'STREAK_DAYS':
        currentVal = userStats.streakDays || 0;
        break;
      case 'STUDY_HOURS':
        currentVal = userStats.studyHours || 0;
        break;
      case 'SKILLS_MASTERED':
        currentVal = userStats.skillsMastered || 0;
        break;
      case 'XR_ACTIVITIES':
        currentVal = userStats.xrActivities || 0;
        break;
      case 'PEER_SESSIONS':
        currentVal = userStats.peerSessions || 0;
        break;
      case 'XP_TOTAL':
        currentVal = userStats.totalXp || 0;
        break;
      default:
        currentVal = ach.progress || 0;
    }

    const isNowUnlocked = currentVal >= ach.target;
    return {
      ...ach,
      progress: Math.min(currentVal, ach.target),
      unlocked: isNowUnlocked,
      unlockedDate: isNowUnlocked ? new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : ach.unlockedDate,
      justUnlocked: isNowUnlocked && !ach.unlocked
    };
  });

  return updatedAchievements;
};

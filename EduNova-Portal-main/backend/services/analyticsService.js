/**
 * EduNova Performance Analytics Service
 * 
 * Computes live learner analytics directly from PostgreSQL:
 * - Study Hours (Planned vs Completed)
 * - Subject & Topic Mastery (Historical Accuracy Distributions)
 * - Revision Radar (Weak Topics & Underperforming Concepts)
 * - Streak & Consistency History (Active Days & Gamification Velocity)
 */

const prisma = require('../config/db');

class AnalyticsService {
  /**
   * Compute comprehensive performance analytics for the authenticated learner
   * @param {string} userId 
   */
  async getLearnerOverview(userId) {
    const [
      profile,
      user,
      studySessions,
      quizAttempts,
      subjectProgresses,
      xpTransactions,
    ] = await Promise.all([
      prisma.learnerProfile.findUnique({ where: { userId } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, learnerType: true, createdAt: true },
      }),
      prisma.studySession.findMany({
        where: { userId },
        orderBy: { plannedDate: 'desc' },
        include: { subject: { select: { id: true, name: true, category: true } } },
      }),
      prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          quiz: {
            include: {
              subject: { select: { id: true, name: true, category: true } },
              topic: { select: { id: true, title: true } },
            },
          },
        },
      }),
      prisma.studentSubjectProgress.findMany({
        where: { userId },
        include: { subject: { select: { id: true, name: true, category: true } } },
      }),
      prisma.xpTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
    ]);

    // ──────────────────────────────────────────────────────────────────────────
    // 1. STUDY HOURS: Planned vs Completed
    // ──────────────────────────────────────────────────────────────────────────
    let totalPlannedMinutes = 0;
    let totalCompletedMinutes = 0;

    studySessions.forEach((session) => {
      totalPlannedMinutes += session.durationMinutes || 0;
      if (session.completed) {
        totalCompletedMinutes += session.durationMinutes || 0;
      }
    });

    const plannedHours = Math.round((totalPlannedMinutes / 60) * 10) / 10;
    const completedHours = Math.round((totalCompletedMinutes / 60) * 10) / 10;
    const studyAdherenceRate =
      plannedHours > 0 ? Math.min(100, Math.round((completedHours / plannedHours) * 100)) : 100;

    // ──────────────────────────────────────────────────────────────────────────
    // 2. SUBJECT & TOPIC MASTERY: Accuracy Distributions Over Time
    // ──────────────────────────────────────────────────────────────────────────
    const subjectStatsMap = new Map();

    quizAttempts.forEach((attempt) => {
      const subject = attempt.quiz?.subject;
      if (!subject) return;

      if (!subjectStatsMap.has(subject.id)) {
        subjectStatsMap.set(subject.id, {
          subjectId: subject.id,
          subjectName: subject.name,
          category: subject.category,
          totalAttempts: 0,
          totalScore: 0,
          totalQuestions: 0,
          accuracySum: 0,
          recentScores: [],
        });
      }

      const stat = subjectStatsMap.get(subject.id);
      stat.totalAttempts += 1;
      stat.totalScore += attempt.score;
      stat.totalQuestions += attempt.totalQuestions;
      stat.accuracySum += attempt.accuracy;
      if (stat.recentScores.length < 5) {
        stat.recentScores.push({
          accuracy: attempt.accuracy,
          date: attempt.createdAt,
        });
      }
    });

    const subjectMastery = Array.from(subjectStatsMap.values()).map((stat) => {
      const avgAccuracy = Math.round(stat.accuracySum / stat.totalAttempts);
      return {
        subjectId: stat.subjectId,
        subjectName: stat.subjectName,
        category: stat.category,
        totalQuizzes: stat.totalAttempts,
        averageAccuracy: avgAccuracy,
        masteryLevel: avgAccuracy >= 85 ? 'MASTERED' : avgAccuracy >= 65 ? 'PROFICIENT' : 'NEEDS_WORK',
        recentHistory: stat.recentScores,
      };
    });

    const totalQuizzesTaken = quizAttempts.length;
    const totalQuestionsAnswered = quizAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const overallAccuracy =
      totalQuizzesTaken > 0
        ? Math.round(quizAttempts.reduce((sum, a) => sum + a.accuracy, 0) / totalQuizzesTaken)
        : 0;

    // ──────────────────────────────────────────────────────────────────────────
    // 3. REVISION RADAR: Weak Topic Detection & Priority Queuing
    // ──────────────────────────────────────────────────────────────────────────
    const flaggedWeakTopics = new Set(profile?.weakTopics || []);

    // Also flag subjects where average accuracy is below 65%
    subjectMastery.forEach((sub) => {
      if (sub.averageAccuracy < 65) {
        flaggedWeakTopics.add(sub.subjectName);
      }
    });

    const revisionRadar = Array.from(flaggedWeakTopics).map((topicName) => {
      // Find matching subject attempt stats if any
      const matchingStat = subjectMastery.find(
        (m) => m.subjectName.toLowerCase() === topicName.toLowerCase()
      );

      const recentAccuracy = matchingStat ? matchingStat.averageAccuracy : 50;
      const urgency = recentAccuracy < 50 ? 'HIGH' : recentAccuracy < 65 ? 'MEDIUM' : 'LOW';

      return {
        topic: topicName,
        urgency,
        recentAccuracy: `${recentAccuracy}%`,
        suggestedAction: `Practice 5 diagnostic questions with Sage AI to solidify ${topicName}.`,
        recommendedStudyMinutes: urgency === 'HIGH' ? 35 : 20,
      };
    });

    // ──────────────────────────────────────────────────────────────────────────
    // 4. STREAK & CONSISTENCY HISTORY
    // ──────────────────────────────────────────────────────────────────────────
    const currentStreakDays = profile?.streakDays || 0;
    const level = profile?.level || 1;
    const xp = profile?.xp || 0;

    // Build last 7 days activity heatmap
    const past7Days = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      // Check if any quiz attempt, study session, or XP transaction happened on this date
      const hasQuiz = quizAttempts.some((a) => a.createdAt >= dayStart && a.createdAt <= dayEnd);
      const hasSession = studySessions.some(
        (s) => s.completed && s.plannedDate >= dayStart && s.plannedDate <= dayEnd
      );
      const hasXp = xpTransactions.some((x) => x.createdAt >= dayStart && x.createdAt <= dayEnd);

      past7Days.push({
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.toISOString().split('T')[0],
        active: hasQuiz || hasSession || hasXp,
      });
    }

    const activeDaysLastWeek = past7Days.filter((d) => d.active).length;
    const weeklyConsistencyRate = Math.round((activeDaysLastWeek / 7) * 100);

    return {
      learner: {
        id: user?.id,
        name: user?.name,
        learnerType: user?.learnerType,
        level,
        xp,
        streakDays: currentStreakDays,
      },
      studyHours: {
        plannedHours,
        completedHours,
        adherenceRate: `${studyAdherenceRate}%`,
        totalSessions: studySessions.length,
        completedSessions: studySessions.filter((s) => s.completed).length,
      },
      assessmentSummary: {
        totalQuizzesTaken,
        totalQuestionsAnswered,
        overallAccuracy: `${overallAccuracy}%`,
        subjectMastery,
      },
      revisionRadar: {
        totalWeakAreas: revisionRadar.length,
        items: revisionRadar,
      },
      consistency: {
        streakDays: currentStreakDays,
        weeklyConsistencyRate: `${weeklyConsistencyRate}%`,
        activeDaysLastWeek,
        weeklyHeatmap: past7Days,
      },
      curriculumProgress: subjectProgresses.map((sp) => ({
        subjectId: sp.subjectId,
        subjectName: sp.subject?.name,
        progress: sp.progress,
        syllabusCoverage: sp.syllabusCoverage,
        targetScore: sp.targetScore,
      })),
    };
  }

  /**
   * Schedule or create a study session
   */
  async createStudySession(userId, { subjectId, durationMinutes = 30, plannedDate }) {
    return await prisma.studySession.create({
      data: {
        userId,
        subjectId,
        durationMinutes: Number(durationMinutes),
        plannedDate: plannedDate ? new Date(plannedDate) : new Date(),
        completed: false,
      },
      include: {
        subject: { select: { id: true, name: true, category: true } },
      },
    });
  }

  /**
   * Complete a scheduled study session and optionally reward XP
   */
  async completeStudySession(userId, sessionId) {
    const session = await prisma.studySession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      const error = new Error('Study session not found or unauthorized');
      error.status = 404;
      throw error;
    }

    return await prisma.$transaction(async (tx) => {
      const updatedSession = await tx.studySession.update({
        where: { id: sessionId },
        data: { completed: true },
        include: { subject: true },
      });

      // Award XP for completing session (e.g. 1 XP per planned minute)
      const xpEarned = Math.max(15, session.durationMinutes);
      await tx.xpTransaction.create({
        data: {
          userId,
          amount: xpEarned,
          sourceTitle: `Study Session: ${session.durationMinutes} mins on ${updatedSession.subject?.name || 'Subject'}`,
        },
      });

      const profile = await tx.learnerProfile.findUnique({ where: { userId } });
      if (profile) {
        const newXp = profile.xp + xpEarned;
        const newLevel = Math.floor(newXp / 250) + 1;
        await tx.learnerProfile.update({
          where: { userId },
          data: { xp: newXp, level: newLevel },
        });
      }

      return {
        session: updatedSession,
        xpEarned,
      };
    });
  }
}

module.exports = new AnalyticsService();

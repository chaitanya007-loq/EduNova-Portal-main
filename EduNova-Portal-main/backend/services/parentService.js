const prisma = require('../config/db');

/**
 * Get comprehensive child overview for an authenticated parent
 */
const getChildOverview = async (parentId) => {
  // 1. Get parent user
  const parent = await prisma.user.findUnique({
    where: { id: parentId },
    select: { id: true, name: true, studentUsername: true, role: true },
  });

  if (!parent) {
    throw { status: 404, message: 'Parent account not found' };
  }

  if (!parent.studentUsername) {
    throw {
      status: 400,
      message: 'No student username linked to this parent account. Please link your student first.',
    };
  }

  // 2. Find linked student
  const student = await prisma.user.findFirst({
    where: {
      studentUsername: parent.studentUsername,
      role: 'STUDENT',
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      studentUsername: true,
      avatar: true,
      learnerType: true,
      createdAt: true,
      learnerProfile: true,
      subjectProgress: {
        include: {
          subject: {
            select: { id: true, name: true, category: true, class: true, board: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
      courseProgress: {
        include: {
          course: {
            select: { id: true, title: true, category: true, difficulty: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
      xpTransactions: {
        take: 7,
        orderBy: { createdAt: 'desc' },
      },
      userMissions: {
        where: { completed: true },
        take: 5,
        include: {
          mission: { select: { title: true, rewardXp: true, category: true } },
        },
        orderBy: { completedAt: 'desc' },
      },
    },
  });

  if (!student) {
    throw {
      status: 404,
      message: `No student found with linked username "${parent.studentUsername}".`,
    };
  }

  // 3. Compute summaries
  const totalSubjects = student.subjectProgress.length;
  const avgSubjectProgress = totalSubjects > 0
    ? student.subjectProgress.reduce((sum, sp) => sum + sp.progress, 0) / totalSubjects
    : 0;

  const totalCourses = student.courseProgress.length;
  const avgCourseProgress = totalCourses > 0
    ? student.courseProgress.reduce((sum, cp) => sum + cp.progress, 0) / totalCourses
    : 0;

  return {
    student: {
      id: student.id,
      name: student.name,
      studentUsername: student.studentUsername,
      avatar: student.avatar,
      learnerType: student.learnerType,
      memberSince: student.createdAt,
    },
    academics: {
      board: student.learnerProfile?.board || 'N/A',
      degree: student.learnerProfile?.degree || null,
      goals: student.learnerProfile?.goals || [],
      weakTopics: student.learnerProfile?.weakTopics || [],
      totalSubjects,
      avgSubjectProgress: Math.round(avgSubjectProgress * 10) / 10,
      totalCourses,
      avgCourseProgress: Math.round(avgCourseProgress * 10) / 10,
    },
    gamification: {
      xp: student.learnerProfile?.xp || 0,
      level: student.learnerProfile?.level || 1,
      streakDays: student.learnerProfile?.streakDays || 0,
      recentActivity: student.xpTransactions,
      completedMissions: student.userMissions.map((um) => ({
        title: um.mission.title,
        rewardXp: um.mission.rewardXp,
        completedAt: um.completedAt,
      })),
    },
    subjects: student.subjectProgress.map((sp) => ({
      id: sp.subject.id,
      name: sp.subject.name,
      category: sp.subject.category,
      progress: sp.progress,
      syllabusCoverage: sp.syllabusCoverage,
      targetScore: sp.targetScore,
    })),
    courses: student.courseProgress.map((cp) => ({
      id: cp.course.id,
      title: cp.course.title,
      category: cp.course.category,
      progress: cp.progress,
      completedModulesCount: cp.completedModuleIds.length,
      enrolledAt: cp.enrolledAt,
    })),
  };
};

module.exports = { getChildOverview };

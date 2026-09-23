const prisma = require('../config/db');

/**
 * Get all subject progress for a student
 */
const getSubjectProgress = async (userId) => {
  const progress = await prisma.studentSubjectProgress.findMany({
    where: { userId },
    include: {
      subject: {
        include: { topics: { orderBy: { order: 'asc' } } },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return progress;
};

/**
 * Update or create subject progress
 */
const updateSubjectProgress = async (userId, subjectId, data) => {
  const { progress, targetScore, syllabusCoverage } = data;

  const updated = await prisma.studentSubjectProgress.upsert({
    where: { userId_subjectId: { userId, subjectId } },
    update: {
      ...(progress !== undefined && { progress }),
      ...(targetScore !== undefined && { targetScore }),
      ...(syllabusCoverage !== undefined && { syllabusCoverage }),
    },
    create: {
      userId,
      subjectId,
      progress: progress || 0,
      targetScore: targetScore || 80,
      syllabusCoverage: syllabusCoverage || 0,
    },
    include: { subject: true },
  });

  return updated;
};

/**
 * Get all course progress for a student
 */
const getCourseProgress = async (userId) => {
  const progress = await prisma.userCourseProgress.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: { orderBy: { order: 'asc' } },
          instructor: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return progress;
};

/**
 * Update course progress (mark module completed)
 */
const updateCourseProgress = async (userId, courseId, data) => {
  const { completedModuleId } = data;

  // Get existing progress
  let courseProgress = await prisma.userCourseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!courseProgress) {
    throw { status: 404, message: 'Not enrolled in this course' };
  }

  // Add module to completed list if not already there
  let completedModuleIds = courseProgress.completedModuleIds || [];
  if (completedModuleId && !completedModuleIds.includes(completedModuleId)) {
    completedModuleIds.push(completedModuleId);
  }

  // Calculate progress percentage
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { _count: { select: { modules: true } } },
  });

  const totalModules = course._count.modules;
  const progressPercent = totalModules > 0
    ? (completedModuleIds.length / totalModules) * 100
    : 0;

  const updated = await prisma.userCourseProgress.update({
    where: { userId_courseId: { userId, courseId } },
    data: {
      completedModuleIds,
      progress: Math.round(progressPercent * 100) / 100,
    },
    include: {
      course: {
        include: { modules: { orderBy: { order: 'asc' } } },
      },
    },
  });

  return updated;
};

/**
 * Get combined dashboard progress for a student
 */
const getDashboardProgress = async (userId) => {
  const [subjectProgress, courseProgress, profile] = await Promise.all([
    prisma.studentSubjectProgress.findMany({
      where: { userId },
      include: { subject: true },
    }),
    prisma.userCourseProgress.findMany({
      where: { userId },
      include: { course: { select: { title: true, category: true } } },
    }),
    prisma.learnerProfile.findUnique({ where: { userId } }),
  ]);

  const avgSubjectProgress = subjectProgress.length > 0
    ? subjectProgress.reduce((sum, sp) => sum + sp.progress, 0) / subjectProgress.length
    : 0;

  const avgCourseProgress = courseProgress.length > 0
    ? courseProgress.reduce((sum, cp) => sum + cp.progress, 0) / courseProgress.length
    : 0;

  return {
    overview: {
      totalSubjects: subjectProgress.length,
      totalCourses: courseProgress.length,
      avgSubjectProgress: Math.round(avgSubjectProgress * 100) / 100,
      avgCourseProgress: Math.round(avgCourseProgress * 100) / 100,
      xp: profile?.xp || 0,
      level: profile?.level || 1,
      streakDays: profile?.streakDays || 0,
    },
    subjectProgress,
    courseProgress,
  };
};

module.exports = {
  getSubjectProgress, updateSubjectProgress,
  getCourseProgress, updateCourseProgress,
  getDashboardProgress,
};

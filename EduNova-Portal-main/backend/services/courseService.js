const prisma = require('../config/db');

/**
 * Get all courses with filters
 */
const getCourses = async ({ category, difficulty, search, instructorId, isPublished, page = 1, limit = 20 }) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);

  const where = {};

  if (isPublished !== undefined) where.isPublished = isPublished;
  else where.isPublished = true; // Default: only published

  if (category) where.category = { contains: category };
  if (difficulty) where.difficulty = difficulty;
  if (instructorId) where.instructorId = instructorId;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { category: { contains: search } },
    ];
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, avatar: true } },
        modules: { orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    }),
    prisma.course.count({ where }),
  ]);

  return { courses, total, page: parsedPage, totalPages: Math.ceil(total / parsedLimit) };
};

/**
 * Get course by ID with full details
 */
const getCourseById = async (courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: { select: { id: true, name: true, avatar: true } },
      modules: { orderBy: { order: 'asc' } },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) throw { status: 404, message: 'Course not found' };
  return course;
};

/**
 * Create a course (Instructor/Admin)
 */
const createCourse = async (data, instructorId) => {
  const { title, description, category, difficulty, thumbnail, modules } = data;

  const course = await prisma.course.create({
    data: {
      title,
      description,
      category,
      instructorId,
      difficulty: difficulty || 'BEGINNER',
      thumbnail,
      ...(modules && modules.length > 0 && {
        modules: {
          create: modules.map((m, i) => ({
            title: m.title,
            duration: m.duration || 0,
            order: m.order || i + 1,
          })),
        },
      }),
    },
    include: {
      modules: { orderBy: { order: 'asc' } },
      instructor: { select: { id: true, name: true, avatar: true } },
    },
  });

  return course;
};

/**
 * Update a course
 */
const updateCourse = async (courseId, data, userId) => {
  // Verify ownership
  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) throw { status: 404, message: 'Course not found' };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (existing.instructorId !== userId && user.role !== 'ADMIN') {
    throw { status: 403, message: 'Not authorized to update this course' };
  }

  const { title, description, category, difficulty, thumbnail, isPublished } = data;

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(category && { category }),
      ...(difficulty && { difficulty }),
      ...(thumbnail !== undefined && { thumbnail }),
      ...(isPublished !== undefined && { isPublished }),
    },
    include: {
      modules: { orderBy: { order: 'asc' } },
      instructor: { select: { id: true, name: true, avatar: true } },
    },
  });

  return course;
};

/**
 * Delete a course
 */
const deleteCourse = async (courseId, userId) => {
  const existing = await prisma.course.findUnique({ where: { id: courseId } });
  if (!existing) throw { status: 404, message: 'Course not found' };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (existing.instructorId !== userId && user.role !== 'ADMIN') {
    throw { status: 403, message: 'Not authorized to delete this course' };
  }

  await prisma.course.delete({ where: { id: courseId } });
  return { message: 'Course deleted successfully' };
};

/**
 * Enroll a student in a course
 */
const enrollCourse = async (courseId, userId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { modules: true },
  });
  if (!course) throw { status: 404, message: 'Course not found' };
  if (!course.isPublished) throw { status: 400, message: 'Course is not published yet' };

  // Check if already enrolled
  const existing = await prisma.userCourseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) throw { status: 400, message: 'Already enrolled in this course' };

  const enrollment = await prisma.userCourseProgress.create({
    data: {
      userId,
      courseId,
      completedModuleIds: [],
      progress: 0,
    },
    include: {
      course: {
        include: {
          modules: { orderBy: { order: 'asc' } },
          instructor: { select: { id: true, name: true } },
        },
      },
    },
  });

  return enrollment;
};

/**
 * Get enrolled courses for a user
 */
const getEnrolledCourses = async (userId) => {
  const enrollments = await prisma.userCourseProgress.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: { orderBy: { order: 'asc' } },
          instructor: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return enrollments;
};

/**
 * Add module to a course
 */
const addModule = async (courseId, { title, duration, order }) => {
  if (!order) {
    const maxModule = await prisma.courseModule.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' },
    });
    order = (maxModule?.order || 0) + 1;
  }

  const module = await prisma.courseModule.create({
    data: { courseId, title, duration: duration || 0, order },
  });

  return module;
};

/**
 * Mark a course module completed, award XP, update course progress atomically
 */
const completeModule = async (userId, courseId, moduleId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Verify module belongs to course
    const courseModule = await tx.courseModule.findFirst({
      where: { id: moduleId, courseId },
      include: { course: { include: { modules: true } } },
    });
    if (!courseModule) throw { status: 404, message: 'Module not found in this course' };

    const totalModules = courseModule.course.modules.length;

    // 2. Find or create enrollment
    let enrollment = await tx.userCourseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    let completedModuleIds = enrollment ? [...enrollment.completedModuleIds] : [];
    const isFirstTimeCompletion = !completedModuleIds.includes(moduleId);

    if (isFirstTimeCompletion) {
      completedModuleIds.push(moduleId);
    }

    const newProgress = totalModules > 0
      ? Math.round((completedModuleIds.length / totalModules) * 100 * 10) / 10
      : 100;

    enrollment = await tx.userCourseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {
        completedModuleIds,
        progress: newProgress,
      },
      create: {
        userId,
        courseId,
        completedModuleIds,
        progress: newProgress,
      },
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    // 3. Award XP if first-time module completion
    let xpAwarded = 0;
    let newXp = 0;
    let newLevel = 1;

    if (isFirstTimeCompletion) {
      xpAwarded = 50;
      await tx.xpTransaction.create({
        data: {
          userId,
          amount: xpAwarded,
          sourceTitle: `Completed Lesson: ${courseModule.title}`,
        },
      });

      const profile = await tx.learnerProfile.findUnique({ where: { userId } });
      if (profile) {
        newXp = profile.xp + xpAwarded;
        newLevel = Math.floor(newXp / 250) + 1;
        await tx.learnerProfile.update({
          where: { userId },
          data: { xp: newXp, level: newLevel },
        });
      }
    }

    return {
      enrollment,
      completedModuleId: moduleId,
      isFirstTimeCompletion,
      xpAwarded,
      newXp,
      newLevel,
    };
  });
};

module.exports = {
  getCourses, getCourseById, createCourse, updateCourse, deleteCourse,
  enrollCourse, getEnrolledCourses, addModule, completeModule,
};

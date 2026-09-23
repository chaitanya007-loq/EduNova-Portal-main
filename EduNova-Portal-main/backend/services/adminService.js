const prisma = require('../config/db');

/**
 * Get system-wide platform metrics
 */
const getMetrics = async () => {
  const [
    totalUsers,
    studentsCount,
    instructorsCount,
    parentsCount,
    coursesCount,
    publishedCoursesCount,
    subjectsCount,
    totalEnrollments,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
    prisma.user.count({ where: { role: 'PARENT' } }),
    prisma.course.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.subject.count(),
    prisma.userCourseProgress.count(),
    prisma.adminAuditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { admin: { select: { name: true, email: true } } },
    }),
  ]);

  // Popular subjects by student enrollment/progress
  const popularSubjects = await prisma.subject.findMany({
    take: 5,
    include: {
      _count: { select: { progress: true } },
    },
    orderBy: {
      progress: { _count: 'desc' },
    },
  });

  return {
    systemHealth: 'OPERATIONAL',
    uptime: process.uptime(),
    databaseStatus: 'CONNECTED',
    timestamp: new Date().toISOString(),
    users: {
      total: totalUsers,
      students: studentsCount,
      instructors: instructorsCount,
      parents: parentsCount,
    },
    content: {
      totalCourses: coursesCount,
      publishedCourses: publishedCoursesCount,
      totalSubjects: subjectsCount,
      totalEnrollments,
    },
    popularSubjects: popularSubjects.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      studentCount: s._count.progress,
    })),
    recentAuditLogs,
  };
};

/**
 * Get paginated users list with filters
 */
const getUsers = async ({ role, search, page = 1, limit = 20 }) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);

  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { studentUsername: { contains: search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        learnerType: true,
        studentUsername: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        learnerProfile: {
          select: { xp: true, level: true, streakDays: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/**
 * Promote / demote user role
 */
const updateUserRole = async (userId, newRole, adminId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { status: 404, message: 'User not found' };

  const previousRole = user.role;

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // Create Audit Log
    await tx.adminAuditLog.create({
      data: {
        adminId,
        action: 'UPDATE_USER_ROLE',
        targetType: 'User',
        targetId: userId,
        details: {
          userName: user.name,
          userEmail: user.email,
          previousRole,
          newRole,
        },
      },
    });

    return updated;
  });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  };
};

/**
 * Create and immediately publish verified course catalog content
 */
const createVerifiedCourse = async (data, adminId) => {
  const { title, description, category, difficulty, thumbnail, modules, instructorId } = data;

  const course = await prisma.$transaction(async (tx) => {
    const newCourse = await tx.course.create({
      data: {
        title,
        description,
        category,
        difficulty: difficulty || 'BEGINNER',
        thumbnail,
        isPublished: true, // Verified by admin
        instructorId: instructorId || adminId,
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
        instructor: { select: { id: true, name: true } },
      },
    });

    await tx.adminAuditLog.create({
      data: {
        adminId,
        action: 'PUBLISH_VERIFIED_COURSE',
        targetType: 'Course',
        targetId: newCourse.id,
        details: { title: newCourse.title, category: newCourse.category },
      },
    });

    return newCourse;
  });

  return course;
};

/**
 * Moderate/delete content (courses or subjects)
 */
const deleteContent = async (type, id, adminId) => {
  const normalizedType = (type || '').toLowerCase();

  return await prisma.$transaction(async (tx) => {
    let deletedTitle = '';

    if (normalizedType === 'course') {
      const existing = await tx.course.findUnique({ where: { id } });
      if (!existing) throw { status: 404, message: 'Course not found' };
      deletedTitle = existing.title;
      await tx.course.delete({ where: { id } });
    } else if (normalizedType === 'subject') {
      const existing = await tx.subject.findUnique({ where: { id } });
      if (!existing) throw { status: 404, message: 'Subject not found' };
      deletedTitle = existing.name;
      await tx.subject.delete({ where: { id } });
    } else {
      throw { status: 400, message: `Unsupported content type "${type}". Must be 'course' or 'subject'.` };
    }

    await tx.adminAuditLog.create({
      data: {
        adminId,
        action: `DELETE_${normalizedType.toUpperCase()}`,
        targetType: type,
        targetId: id,
        details: { title: deletedTitle },
      },
    });

    return {
      message: `${type} "${deletedTitle}" successfully removed by admin`,
      type,
      id,
    };
  });
};

module.exports = {
  getMetrics,
  getUsers,
  updateUserRole,
  createVerifiedCourse,
  deleteContent,
};

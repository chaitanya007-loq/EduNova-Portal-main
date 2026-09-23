const prisma = require('../config/db');

/**
 * Get user profile by ID
 */
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      learnerProfile: true,
      subjectProgress: {
        include: { subject: true },
      },
      courseProgress: {
        include: {
          course: {
            include: { modules: true },
          },
        },
      },
      xpTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!user) throw { status: 404, message: 'User not found' };

  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

/**
 * Update user profile
 */
const updateProfile = async (userId, data) => {
  const allowedFields = ['name', 'avatar', 'learnerType', 'studentUsername'];
  const updates = {};

  const effectiveUsername = data.studentUsername || data.username;
  if (effectiveUsername !== undefined) {
    updates.studentUsername = effectiveUsername;
  }

  allowedFields.forEach((field) => {
    if (field !== 'studentUsername' && data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: updates,
    include: { learnerProfile: true },
  });

  // Also update board / degree on learnerProfile if supplied
  const board = data.board !== undefined ? data.board : (data.education && typeof data.education === 'object' ? data.education.board : undefined);
  const degree = data.degree !== undefined ? data.degree : (data.education && typeof data.education === 'object' ? data.education.degree : undefined);

  if (board !== undefined || degree !== undefined) {
    await prisma.learnerProfile.upsert({
      where: { userId },
      update: {
        ...(board !== undefined && { board }),
        ...(degree !== undefined && { degree }),
      },
      create: {
        userId,
        board: board || null,
        degree: degree || null,
        goals: [],
        weakTopics: [],
        xp: 0,
        level: 1,
        streakDays: 0,
      },
    });
  }

  // Refetch user with updated learnerProfile
  const refreshedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { learnerProfile: true },
  });

  const { passwordHash, ...safeUser } = (refreshedUser || user);
  return safeUser;
};

/**
 * Update learner profile (board, degree, goals, weak topics)
 */
const updateLearnerProfile = async (userId, data) => {
  const allowedFields = ['board', 'degree', 'goals', 'weakTopics'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) updates[field] = data[field];
  });

  const profile = await prisma.learnerProfile.upsert({
    where: { userId },
    update: updates,
    create: {
      userId,
      ...updates,
    },
  });

  return profile;
};

/**
 * Get all users (Admin only)
 */
const getAllUsers = async ({ role, learnerType, search, page = 1, limit = 20 }) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);

  const where = {};

  if (role) where.role = role;
  if (learnerType) where.learnerType = learnerType;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
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
        avatar: true,
        createdAt: true,
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

  return { users, total, page: parsedPage, totalPages: Math.ceil(total / parsedLimit) };
};

/**
 * Delete user (Admin only)
 */
const deleteUser = async (userId) => {
  await prisma.user.delete({ where: { id: userId } });
  return { message: 'User deleted successfully' };
};

/**
 * Get child data for parent
 */
const getChildData = async (parentId) => {
  const parent = await prisma.user.findUnique({
    where: { id: parentId },
    select: { studentUsername: true },
  });

  if (!parent || !parent.studentUsername) {
    throw { status: 404, message: 'No linked student found' };
  }

  const child = await prisma.user.findFirst({
    where: { studentUsername: parent.studentUsername, role: 'STUDENT' },
    include: {
      learnerProfile: true,
      subjectProgress: { include: { subject: true } },
      courseProgress: {
        include: { course: { select: { title: true, category: true } } },
      },
      xpTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!child) throw { status: 404, message: 'Linked student not found' };

  const { passwordHash, ...safeChild } = child;
  return safeChild;
};

module.exports = { getProfile, updateProfile, updateLearnerProfile, getAllUsers, deleteUser, getChildData };

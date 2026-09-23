const prisma = require('../config/db');

/**
 * Get available missions for a user
 */
const getMissions = async (userId, { period } = {}) => {
  const where = { isActive: true };
  if (period) where.period = period;

  const missions = await prisma.mission.findMany({
    where,
    include: {
      userMissions: {
        where: { userId },
      },
    },
    orderBy: { period: 'asc' },
  });

  // Format response with user progress
  return missions.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    rewardXp: m.rewardXp,
    category: m.category,
    period: m.period,
    userProgress: m.userMissions[0]?.progress || 0,
    completed: m.userMissions[0]?.completed || false,
    completedAt: m.userMissions[0]?.completedAt || null,
  }));
};

/**
 * Update mission progress for a user
 */
const updateMissionProgress = async (userId, missionId, progressValue) => {
  const mission = await prisma.mission.findUnique({ where: { id: missionId } });
  if (!mission) throw { status: 404, message: 'Mission not found' };

  const isCompleted = progressValue >= 100;

  const userMission = await prisma.userMission.upsert({
    where: { userId_missionId: { userId, missionId } },
    update: {
      progress: Math.min(progressValue, 100),
      completed: isCompleted,
      ...(isCompleted && { completedAt: new Date() }),
    },
    create: {
      userId,
      missionId,
      progress: Math.min(progressValue, 100),
      completed: isCompleted,
      ...(isCompleted && { completedAt: new Date() }),
    },
  });

  // Award XP if just completed
  if (isCompleted && userMission.completed) {
    await awardXp(userId, mission.rewardXp, `Mission: ${mission.title}`);
  }

  return userMission;
};

/**
 * Calculate level from total XP
 * Level thresholds: L1=0, L2=100, L3=300, L4=600, L5=1000, L6=1500, ...
 */
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200, 6500, 8000, 10000];

const calculateLevel = (xp) => {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
};

/**
 * Award XP to a user and update their profile atomically
 */
const awardXp = async (userId, amount, sourceTitle) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create XP transaction
    const transaction = await tx.xpTransaction.create({
      data: { userId, amount, sourceTitle },
    });

    // 2. Fetch or initialize learner profile
    let profile = await tx.learnerProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await tx.learnerProfile.create({
        data: {
          userId,
          goals: [],
          weakTopics: [],
          xp: 0,
          level: 1,
          streakDays: 0,
        },
      });
    }

    const prevLevel = profile.level || 1;
    const newXp = Math.max(0, profile.xp + amount);
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > prevLevel;

    const updatedProfile = await tx.learnerProfile.update({
      where: { userId },
      data: { xp: newXp, level: newLevel },
    });

    return {
      transaction,
      leveledUp,
      newXp: updatedProfile.xp,
      newLevel: updatedProfile.level,
      prevLevel,
    };
  });
};

/**
 * Get unified gamification summary for authenticated student
 */
const getGamificationSummary = async (userId) => {
  let profile = await prisma.learnerProfile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.learnerProfile.create({
      data: {
        userId,
        goals: [],
        weakTopics: [],
        xp: 0,
        level: 1,
        streakDays: 0,
      },
    });
  }

  const currentLvl = profile.level || 1;
  const currentLevelBaseXp = LEVEL_THRESHOLDS[currentLvl - 1] ?? (currentLvl - 1) * 1000;
  const nextLevelXp = LEVEL_THRESHOLDS[currentLvl] ?? currentLvl * 1000 + 1000;
  const span = Math.max(1, nextLevelXp - currentLevelBaseXp);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((profile.xp - currentLevelBaseXp) / span) * 100))
  );

  const xpHistory = await prisma.xpTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return {
    xp: profile.xp,
    level: profile.level,
    streakDays: profile.streakDays,
    nextLevelXp,
    currentLevelBaseXp,
    progressPercent,
    xpHistory,
  };
};


/**
 * Get XP transaction history
 */
const getXpHistory = async (userId, { page = 1, limit = 20 } = {}) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);

  const [transactions, total] = await Promise.all([
    prisma.xpTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    }),
    prisma.xpTransaction.count({ where: { userId } }),
  ]);

  return { transactions, total, page: parsedPage, totalPages: Math.ceil(total / parsedLimit) };
};

/**
 * Update streak for a user (call on daily login)
 */
const updateStreak = async (userId) => {
  const profile = await prisma.learnerProfile.findUnique({ where: { userId } });
  if (!profile) return null;

  const now = new Date();
  const lastUpdate = profile.updatedAt;
  const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);

  let newStreak = profile.streakDays;

  if (hoursSinceUpdate >= 20 && hoursSinceUpdate < 48) {
    // Within valid streak window (20-48 hours)
    newStreak += 1;
  } else if (hoursSinceUpdate >= 48) {
    // Streak broken
    newStreak = 1;
  }
  // If less than 20 hours, don't update (already counted today)

  if (newStreak !== profile.streakDays) {
    await prisma.learnerProfile.update({
      where: { userId },
      data: { streakDays: newStreak },
    });

    // Award streak XP
    if (newStreak > 0) {
      await awardXp(userId, 10, `Daily Login Streak (Day ${newStreak})`);
    }
  }

  return { streakDays: newStreak };
};

/**
 * Get leaderboard
 */
const getLeaderboard = async ({ limit = 20 } = {}) => {
  const parsedLimit = Math.max(1, parseInt(limit, 10) || 20);

  const profiles = await prisma.learnerProfile.findMany({
    orderBy: { xp: 'desc' },
    take: parsedLimit,
    include: {
      user: { select: { id: true, name: true, avatar: true, role: true } },
    },
  });

  return profiles.map((p, i) => ({
    rank: i + 1,
    userId: p.user.id,
    name: p.user.name,
    avatar: p.user.avatar,
    xp: p.xp,
    level: p.level,
    streakDays: p.streakDays,
  }));
};

/**
 * Claim/complete mission atomically, increment level/XP, update streak
 */
const claimMission = async (userId, missionId) => {
  return await prisma.$transaction(async (tx) => {
    const mission = await tx.mission.findUnique({ where: { id: missionId } });
    if (!mission) throw { status: 404, message: 'Mission not found' };

    const userMission = await tx.userMission.findUnique({
      where: { userId_missionId: { userId, missionId } },
    });

    if (userMission?.completed) {
      throw { status: 400, message: 'Mission already completed and claimed' };
    }

    const updatedUserMission = await tx.userMission.upsert({
      where: { userId_missionId: { userId, missionId } },
      update: { completed: true, progress: 100, completedAt: new Date() },
      create: { userId, missionId, completed: true, progress: 100, completedAt: new Date() },
    });

    await tx.xpTransaction.create({
      data: {
        userId,
        amount: mission.rewardXp,
        sourceTitle: `Claimed Mission: ${mission.title}`,
      },
    });

    const profile = await tx.learnerProfile.findUnique({ where: { userId } });
    let newXp = mission.rewardXp;
    let newLevel = 1;
    let newStreak = 1;
    let prevLevel = 1;

    if (profile) {
      prevLevel = profile.level || 1;
      newXp = profile.xp + mission.rewardXp;
      newLevel = calculateLevel(newXp);
      newStreak = (profile.streakDays || 0) + 1;
      await tx.learnerProfile.update({
        where: { userId },
        data: { xp: newXp, level: newLevel, streakDays: newStreak },
      });
    }

    return {
      userMission: updatedUserMission,
      missionTitle: mission.title,
      rewardXp: mission.rewardXp,
      newXp,
      newLevel,
      streakDays: newStreak,
      leveledUp: newLevel > prevLevel,
    };
  });
};

module.exports = {
  getMissions, updateMissionProgress, awardXp,
  getXpHistory, updateStreak, getLeaderboard, claimMission,
  getGamificationSummary, calculateLevel,
};


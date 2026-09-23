const prisma = require('../config/db');

const emptyDna = {
  overallIndex: 0,
  totalLogs: 0,
  categories: {
    problemSolving: 0,
    programming: 0,
    mathematics: 0,
    communication: 0,
  },
};

const categoryForSubject = (subject = {}) => {
  const value = `${subject.name || ''} ${subject.category || ''}`.toLowerCase();
  if (/math|calculus|algebra|geometry|statistics/.test(value)) return 'mathematics';
  if (/program|computer|coding|software|database|web|technical/.test(value)) return 'programming';
  if (/english|communication|language|writing|literature/.test(value)) return 'communication';
  return 'problemSolving';
};

const getSkillDna = async (req, res, next) => {
  try {
    const [attempts, courseProgress] = await Promise.all([
      prisma.quizAttempt.findMany({
        where: { userId: req.user.id },
        include: { quiz: { include: { subject: true } } },
      }),
      prisma.userCourseProgress.findMany({
        where: { userId: req.user.id },
        select: { completedModuleIds: true },
      }),
    ]);

    if (attempts.length === 0) {
      return res.json({
        success: true,
        message: 'Not enough learning evidence yet',
        data: {
          ...emptyDna,
          emptyState: 'Take a Skill Assessment or complete lessons to map your Skill DNA.',
        },
      });
    }

    const totals = { ...emptyDna.categories };
    const counts = { problemSolving: 0, programming: 0, mathematics: 0, communication: 0 };
    attempts.forEach((attempt) => {
      const category = categoryForSubject(attempt.quiz?.subject);
      totals[category] += Number(attempt.accuracy) || 0;
      counts[category] += 1;
    });

    const categories = Object.fromEntries(
      Object.keys(totals).map((category) => [
        category,
        counts[category] ? Math.round(totals[category] / counts[category]) : 0,
      ])
    );
    const completedModules = courseProgress.reduce(
      (total, progress) => total + progress.completedModuleIds.length,
      0
    );

    return res.json({
      success: true,
      message: 'Skill DNA calculated from verified learning activity',
      data: {
        overallIndex: Math.round(Object.values(categories).reduce((sum, score) => sum + score, 0) / 4),
        totalLogs: attempts.length + completedModules,
        categories,
        quizAttempts: attempts.length,
        completedModules,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMarketplace = async (req, res, next) => {
  try {
    const exchanges = await prisma.skillExchange.findMany({
      where: { status: { in: ['PENDING', 'ACCEPTED'] } },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, avatar: true, learnerType: true } },
        receiver: { select: { id: true, name: true, avatar: true, learnerType: true } },
      },
    });
    const listings = exchanges.map((exchange) => ({
      id: exchange.id,
      userId: exchange.senderId,
      name: exchange.sender.name,
      avatar: exchange.sender.avatar,
      learnerType: exchange.sender.learnerType,
      skillOffered: exchange.skillOffered,
      skillWanted: exchange.skillWanted,
      status: exchange.status,
      createdAt: exchange.createdAt,
    }));
    return res.json({ success: true, message: 'Skill marketplace listings retrieved', data: listings, count: listings.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSkillDna, getMarketplace };
const prisma = require('../config/db');

/**
 * Helper to normalize goals stored in PostgreSQL String[]
 * Handles both plain strings and JSON-stringified goal objects
 */
const parseGoal = (rawGoal, index) => {
  if (!rawGoal) return null;
  let parsed = rawGoal;
  if (typeof rawGoal === 'string') {
    try {
      parsed = JSON.parse(rawGoal);
    } catch (e) {
      parsed = { title: rawGoal };
    }
  }
  if (typeof parsed === 'object' && parsed !== null) {
    return {
      id: parsed.id || `goal_${index + 1}`,
      title: parsed.title || parsed.name || String(rawGoal),
      targetDate: parsed.targetDate || '2026-12-31',
      progress: typeof parsed.progress === 'number' ? parsed.progress : 0,
      createdAt: parsed.createdAt || new Date().toISOString(),
    };
  }
  return {
    id: `goal_${index + 1}`,
    title: String(rawGoal),
    targetDate: '2026-12-31',
    progress: 0,
  };
};

const serializeGoals = (goals) => goals.map((goal) => (
  typeof goal === 'string' ? goal : JSON.stringify(goal)
));

/**
 * Helper to ensure a LearnerProfile exists for the given user
 */
const getOrCreateLearnerProfile = async (userId, tx = prisma) => {
  let profile = await tx.learnerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          learnerType: true,
          studentUsername: true,
          avatar: true,
        },
      },
    },
  });

  if (!profile) {
    profile = await tx.learnerProfile.create({
      data: {
        userId,
        board: null,
        degree: null,
        goals: [],
        weakTopics: [],
        xp: 0,
        level: 1,
        streakDays: 0,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            learnerType: true,
            studentUsername: true,
            avatar: true,
          },
        },
      },
    });
  }

  return profile;
};

/**
 * @desc    Get authenticated user's learner profile
 * @route   GET /api/learners/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const profile = await getOrCreateLearnerProfile(req.user.id);
    let goalsRaw = profile.goals;
    if (typeof goalsRaw === 'string') {
      try { goalsRaw = JSON.parse(goalsRaw); } catch (e) { goalsRaw = []; }
    }
    const goalsList = Array.isArray(goalsRaw) ? goalsRaw : [];
    const parsedGoals = goalsList.map(parseGoal).filter(Boolean);

    res.json({
      success: true,
      data: {
        ...profile,
        parsedGoals,
      },
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user's learning goals
 * @route   GET /api/learners/goals
 * @access  Private
 */
const getGoals = async (req, res) => {
  try {
    const profile = await getOrCreateLearnerProfile(req.user.id);
    let goalsRaw = profile.goals;
    if (typeof goalsRaw === 'string') {
      try { goalsRaw = JSON.parse(goalsRaw); } catch (e) { goalsRaw = []; }
    }
    const goalsList = Array.isArray(goalsRaw) ? goalsRaw : [];
    const parsedGoals = goalsList.map(parseGoal).filter(Boolean);
    res.json({ success: true, data: parsedGoals });
  } catch (error) {
    console.error('getGoals error:', error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add a new learning goal
 * @route   POST /api/learners/goals
 * @access  Private
 */
const addGoal = async (req, res) => {
  try {
    const { title, targetDate = '2026-12-31', progress = 0 } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Goal title is required' });
    }

    const newGoalObj = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      targetDate,
      progress: Number(progress) || 0,
      createdAt: new Date().toISOString(),
    };

    const profile = await getOrCreateLearnerProfile(req.user.id);
    let existingGoals = profile.goals;
    if (typeof existingGoals === 'string') {
      try { existingGoals = JSON.parse(existingGoals); } catch (e) { existingGoals = []; }
    }
    if (!Array.isArray(existingGoals)) existingGoals = [];

    const updatedGoalsList = [...existingGoals, newGoalObj];

    const updatedProfile = await prisma.learnerProfile.update({
      where: { userId: req.user.id },
      data: {
        goals: serializeGoals(updatedGoalsList),
      },
    });

    let resultGoals = updatedProfile.goals;
    if (typeof resultGoals === 'string') {
      try { resultGoals = JSON.parse(resultGoals); } catch (e) { resultGoals = []; }
    }
    const parsedGoals = (Array.isArray(resultGoals) ? resultGoals : []).map(parseGoal).filter(Boolean);

    res.status(201).json({
      success: true,
      message: 'Learning goal added successfully',
      data: parsedGoals,
      newGoal: newGoalObj,
    });
  } catch (error) {
    console.error('addGoal error:', error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update an existing learning goal
 * @route   PATCH /api/learners/goals/:id
 * @access  Private
 */
const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const profile = await getOrCreateLearnerProfile(req.user.id);
    let goalsRaw = profile.goals;
    if (typeof goalsRaw === 'string') {
      try { goalsRaw = JSON.parse(goalsRaw); } catch (e) { goalsRaw = []; }
    }
    const existingGoals = Array.isArray(goalsRaw) ? goalsRaw : [];
    const existingParsed = existingGoals.map(parseGoal).filter(Boolean);

    const goalIndex = existingParsed.findIndex((g) => g.id === id || g.title === id);
    if (goalIndex === -1) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    const updatedGoal = {
      ...existingParsed[goalIndex],
      ...updates,
      id: existingParsed[goalIndex].id, // preserve id
    };

    existingParsed[goalIndex] = updatedGoal;

    await prisma.learnerProfile.update({
      where: { userId: req.user.id },
      data: { goals: serializeGoals(existingParsed) },
    });

    res.json({
      success: true,
      message: 'Learning goal updated successfully',
      data: existingParsed,
      updatedGoal,
    });
  } catch (error) {
    console.error('updateGoal error:', error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a learning goal
 * @route   DELETE /api/learners/goals/:id
 * @access  Private
 */
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await getOrCreateLearnerProfile(req.user.id);
    let goalsRaw = profile.goals;
    if (typeof goalsRaw === 'string') {
      try { goalsRaw = JSON.parse(goalsRaw); } catch (e) { goalsRaw = []; }
    }
    const existingGoals = Array.isArray(goalsRaw) ? goalsRaw : [];
    const existingParsed = existingGoals.map(parseGoal).filter(Boolean);

    const filteredGoals = existingParsed.filter((g) => g.id !== id && g.title !== id);

    await prisma.learnerProfile.update({
      where: { userId: req.user.id },
      data: { goals: serializeGoals(filteredGoals) },
    });

    res.json({
      success: true,
      message: 'Learning goal removed',
      data: filteredGoals,
    });
  } catch (error) {
    console.error('deleteGoal error:', error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update learner type
 * @route   PATCH /api/learners/type
 * @access  Private
 */
const updateLearnerType = async (req, res) => {
  try {
    const { learnerType, board, degree } = req.body;
    const validTypes = ['SCHOOL', 'COLLEGE', 'SKILLS', 'EXAM'];
    const upperType = (learnerType || '').toUpperCase();

    if (!validTypes.includes(upperType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid learnerType. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: req.user.id },
        data: { learnerType: upperType },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          learnerType: true,
          studentUsername: true,
          avatar: true,
        },
      });

      const updatedProfile = await tx.learnerProfile.upsert({
        where: { userId: req.user.id },
        update: {
          ...(board !== undefined && { board }),
          ...(degree !== undefined && { degree }),
        },
        create: {
          userId: req.user.id,
          board: board || null,
          degree: degree || null,
          goals: [],
          weakTopics: [],
          xp: 0,
          level: 1,
          streakDays: 0,
        },
      });

      return { user: updatedUser, profile: updatedProfile };
    });

    res.json({
      success: true,
      message: 'Learner type updated successfully',
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Complete onboarding & save user educational profile
 * @route   POST /api/learners/onboarding
 * @access  Private
 */
const completeOnboarding = async (req, res) => {
  try {
    const {
      learnerType,
      academicDetails,
      board,
      degree,
      goals,
      subjectIds,
    } = req.body;

    const upperType = (learnerType || 'SCHOOL').toUpperCase();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update User learnerType
      const updatedUser = await tx.user.update({
        where: { id: req.user.id },
        data: { learnerType: upperType },
      });

      // 2. Format goals array if supplied
      const goalsSerialized = Array.isArray(goals)
        ? goals.map((g) => (typeof g === 'object' ? JSON.stringify(g) : String(g)))
        : [];

      // 3. Upsert LearnerProfile
      const updatedProfile = await tx.learnerProfile.upsert({
        where: { userId: req.user.id },
        update: {
          board: board || academicDetails?.board || null,
          degree: degree || academicDetails?.degree || null,
          academicDetails: academicDetails || {},
          goals: goalsSerialized,
          onboardingCompleted: true,
        },
        create: {
          userId: req.user.id,
          board: board || academicDetails?.board || null,
          degree: degree || academicDetails?.degree || null,
          academicDetails: academicDetails || {},
          goals: goalsSerialized,
          onboardingCompleted: true,
          xp: 0,
          level: 1,
          streakDays: 0,
        },
      });

      // 4. Connect selected subjects to student subject progress if subjectIds provided
      if (Array.isArray(subjectIds) && subjectIds.length > 0) {
        for (const subjectId of subjectIds) {
          await tx.studentSubjectProgress.upsert({
            where: {
              userId_subjectId: {
                userId: req.user.id,
                subjectId,
              },
            },
            update: {},
            create: {
              userId: req.user.id,
              subjectId,
              progress: 0.0,
              targetScore: 80,
              syllabusCoverage: 0.0,
            },
          });
        }
      }

      return { user: updatedUser, profile: updatedProfile };
    });

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  updateLearnerType,
  completeOnboarding,
};

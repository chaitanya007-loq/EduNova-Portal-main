const gamificationService = require('../services/gamificationService');

/**
 * @desc    Get available missions
 * @route   GET /api/gamification/missions
 * @access  Private
 */
const getMissions = async (req, res) => {
  try {
    const missions = await gamificationService.getMissions(req.user.id, req.query);
    res.json({ success: true, data: missions });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update mission progress
 * @route   PUT /api/gamification/missions/:missionId
 * @access  Private
 */
const updateMissionProgress = async (req, res) => {
  try {
    const result = await gamificationService.updateMissionProgress(
      req.user.id, req.params.missionId, req.body.progress
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get XP history
 * @route   GET /api/gamification/xp
 * @access  Private
 */
const getXpHistory = async (req, res) => {
  try {
    const result = await gamificationService.getXpHistory(req.user.id, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update daily streak
 * @route   POST /api/gamification/streak
 * @access  Private
 */
const updateStreak = async (req, res) => {
  try {
    const result = await gamificationService.updateStreak(req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get leaderboard
 * @route   GET /api/gamification/leaderboard
 * @access  Public
 */
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await gamificationService.getLeaderboard(req.query);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Claim and complete a mission
 * @route   POST /api/gamification/missions/:id/complete
 * @access  Private
 */
const completeMission = async (req, res) => {
  try {
    const result = await gamificationService.claimMission(req.user.id, req.params.id);
    res.json({
      success: true,
      message: `Mission claimed! +${result.rewardXp} XP awarded.`,
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Award custom XP to user
 * @route   POST /api/gamification/xp
 * @access  Private
 */
const addXp = async (req, res) => {
  try {
    const { amount, sourceTitle = 'Learning Activity' } = req.body;
    const safeAmount = Number(amount) || 0;
    const result = await gamificationService.awardXp(req.user.id, safeAmount, sourceTitle);
    res.json({
      success: true,
      message: `+${safeAmount} XP awarded!`,
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get gamification summary for current student
 * @route   GET /api/gamification/summary
 * @access  Private
 */
const getSummary = async (req, res) => {
  try {
    const summary = await gamificationService.getGamificationSummary(req.user.id);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMissions, updateMissionProgress, completeMission,
  getXpHistory, updateStreak, getLeaderboard, addXp, getSummary,
};


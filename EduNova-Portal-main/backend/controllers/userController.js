const userService = require('../services/userService');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update learner profile
 * @route   PUT /api/users/learner-profile
 * @access  Private (STUDENT)
 */
const updateLearnerProfile = async (req, res) => {
  try {
    const profile = await userService.updateLearnerProfile(req.user.id, req.body);
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (ADMIN)
 */
const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private (ADMIN)
 */
const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get child data for parent
 * @route   GET /api/users/child
 * @access  Private (PARENT)
 */
const getChildData = async (req, res) => {
  try {
    const child = await userService.getChildData(req.user.id);
    res.json({ success: true, data: child });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, updateLearnerProfile, getAllUsers, deleteUser, getChildData };

const progressService = require('../services/progressService');

/**
 * @desc    Get all subject progress for current user
 * @route   GET /api/progress/subjects
 * @access  Private
 */
const getSubjectProgress = async (req, res) => {
  try {
    const progress = await progressService.getSubjectProgress(req.user.id);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update subject progress
 * @route   PUT /api/progress/subjects/:subjectId
 * @access  Private (STUDENT)
 */
const updateSubjectProgress = async (req, res) => {
  try {
    const progress = await progressService.updateSubjectProgress(req.user.id, req.params.subjectId, req.body);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all course progress for current user
 * @route   GET /api/progress/courses
 * @access  Private
 */
const getCourseProgress = async (req, res) => {
  try {
    const progress = await progressService.getCourseProgress(req.user.id);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update course progress (complete a module)
 * @route   PUT /api/progress/courses/:courseId
 * @access  Private (STUDENT)
 */
const updateCourseProgress = async (req, res) => {
  try {
    const progress = await progressService.updateCourseProgress(req.user.id, req.params.courseId, req.body);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get dashboard progress summary
 * @route   GET /api/progress/dashboard
 * @access  Private
 */
const getDashboardProgress = async (req, res) => {
  try {
    const dashboard = await progressService.getDashboardProgress(req.user.id);
    res.json({ success: true, data: dashboard });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = { getSubjectProgress, updateSubjectProgress, getCourseProgress, updateCourseProgress, getDashboardProgress };

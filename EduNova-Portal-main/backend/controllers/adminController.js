const adminService = require('../services/adminService');

/**
 * @desc    Get system-wide metrics and stats
 * @route   GET /api/admin/metrics
 * @access  Private (ADMIN)
 */
const getMetrics = async (req, res) => {
  try {
    const metrics = await adminService.getMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get paginated users
 * @route   GET /api/admin/users
 * @access  Private (ADMIN)
 */
const getUsers = async (req, res) => {
  try {
    const result = await adminService.getUsers(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Promote or demote user role
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private (ADMIN)
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }
    const updatedUser = await adminService.updateUserRole(req.params.id, role, req.user.id);
    res.json({ success: true, message: `User role updated to ${role}`, data: updatedUser });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create and publish verified course content
 * @route   POST /api/admin/courses
 * @access  Private (ADMIN)
 */
const createCourse = async (req, res) => {
  try {
    const course = await adminService.createVerifiedCourse(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Verified course created and published', data: course });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    res.json({ success: true, data: await adminService.getCourses(req.query) });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await adminService.updateCourse(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: 'Course updated', data: course });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    res.json({ success: true, data: await adminService.getSubjects(req.query) });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const subject = await adminService.createSubject(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Subject created', data: subject });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subject = await adminService.updateSubject(req.params.id, req.body, req.user.id);
    res.json({ success: true, message: 'Subject updated', data: subject });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Moderate content (delete course or subject)
 * @route   DELETE /api/admin/content/:type/:id
 * @access  Private (ADMIN)
 */
const deleteContent = async (req, res) => {
  try {
    const result = await adminService.deleteContent(req.params.type, req.params.id, req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMetrics,
  getUsers,
  updateUserRole,
  createCourse,
  getCourses,
  updateCourse,
  getSubjects,
  createSubject,
  updateSubject,
  deleteContent,
};

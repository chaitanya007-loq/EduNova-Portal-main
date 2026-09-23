const courseService = require('../services/courseService');

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
const getCourses = async (req, res) => {
  try {
    const result = await courseService.getCourses(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a course
 * @route   POST /api/courses
 * @access  Private (INSTRUCTOR, ADMIN)
 */
const createCourse = async (req, res) => {
  try {
    const course = await courseService.createCourse(req.body, req.user.id);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a course
 * @route   PUT /api/courses/:id
 * @access  Private (INSTRUCTOR owner, ADMIN)
 */
const updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/courses/:id
 * @access  Private (INSTRUCTOR owner, ADMIN)
 */
const deleteCourse = async (req, res) => {
  try {
    const result = await courseService.deleteCourse(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Enroll in a course
 * @route   POST /api/courses/:id/enroll
 * @access  Private (STUDENT)
 */
const enrollCourse = async (req, res) => {
  try {
    const enrollment = await courseService.enrollCourse(req.params.id, req.user.id);
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get my enrolled courses
 * @route   GET /api/courses/enrolled/me
 * @access  Private (STUDENT)
 */
const getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await courseService.getEnrolledCourses(req.user.id);
    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add module to course
 * @route   POST /api/courses/:id/modules
 * @access  Private (INSTRUCTOR, ADMIN)
 */
const addModule = async (req, res) => {
  try {
    const module = await courseService.addModule(req.params.id, req.body);
    res.status(201).json({ success: true, data: module });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Complete a course module and award XP
 * @route   POST /api/courses/:id/modules/:moduleId/complete
 * @access  Private (STUDENT)
 */
const completeModule = async (req, res) => {
  try {
    const result = await courseService.completeModule(req.user.id, req.params.id, req.params.moduleId);
    res.json({
      success: true,
      message: result.isFirstTimeCompletion ? `Module completed! +${result.xpAwarded} XP awarded.` : 'Module marked as completed.',
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCourses, getCourseById, createCourse, updateCourse, deleteCourse,
  enrollCourse, getEnrolledCourses, addModule, completeModule,
};

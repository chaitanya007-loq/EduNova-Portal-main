const subjectService = require('../services/subjectService');

/**
 * @desc    Get all subjects
 * @route   GET /api/subjects
 * @access  Public
 */
const getSubjects = async (req, res) => {
  try {
    const subjects = await subjectService.getSubjects(req.query);
    res.json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get subject by ID
 * @route   GET /api/subjects/:id
 * @access  Public
 */
const getSubjectById = async (req, res) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.id);
    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a subject
 * @route   POST /api/subjects
 * @access  Private (ADMIN, INSTRUCTOR)
 */
const createSubject = async (req, res) => {
  try {
    const subject = await subjectService.createSubject(req.body, req.user.id);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a subject
 * @route   PUT /api/subjects/:id
 * @access  Private (ADMIN, INSTRUCTOR)
 */
const updateSubject = async (req, res) => {
  try {
    const subject = await subjectService.updateSubject(req.params.id, req.body);
    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a subject
 * @route   DELETE /api/subjects/:id
 * @access  Private (ADMIN)
 */
const deleteSubject = async (req, res) => {
  try {
    const result = await subjectService.deleteSubject(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add topic to subject
 * @route   POST /api/subjects/:id/topics
 * @access  Private (ADMIN, INSTRUCTOR)
 */
const addTopic = async (req, res) => {
  try {
    const topic = await subjectService.addTopic(req.params.id, req.body);
    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a topic
 * @route   DELETE /api/subjects/topics/:topicId
 * @access  Private (ADMIN, INSTRUCTOR)
 */
const deleteTopic = async (req, res) => {
  try {
    const result = await subjectService.deleteTopic(req.params.topicId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Select / enroll in a subject (link to dashboard)
 * @route   POST /api/subjects/select
 * @access  Private (STUDENT)
 */
const selectSubject = async (req, res) => {
  try {
    const { subjectId } = req.body;
    if (!subjectId) {
      return res.status(400).json({ success: false, message: 'subjectId is required' });
    }
    const progress = await subjectService.selectSubject(req.user.id, subjectId);
    res.status(201).json({ success: true, message: 'Subject added to your dashboard', data: progress });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update subject coverage and weak topics
 * @route   PATCH /api/subjects/:id/progress
 * @access  Private (STUDENT)
 */
const updateProgress = async (req, res) => {
  try {
    const result = await subjectService.updateProgressAndWeakTopics(req.user.id, req.params.id, req.body);
    res.json({ success: true, message: 'Subject progress updated successfully', data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get student's enrolled subjects
 * @route   GET /api/subjects/enrolled
 * @access  Private (STUDENT)
 */
const getEnrolledSubjects = async (req, res) => {
  try {
    const enrollments = await subjectService.getEnrolledSubjects(req.user.id);
    res.json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Unenroll / remove a subject from dashboard
 * @route   DELETE /api/subjects/:id/enrollment
 * @access  Private (STUDENT)
 */
const unenrollSubject = async (req, res) => {
  try {
    const result = await subjectService.unenrollSubject(req.user.id, req.params.id);
    res.json({ success: true, message: 'Subject removed from dashboard', data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject,
  addTopic, deleteTopic, selectSubject, updateProgress,
  getEnrolledSubjects, unenrollSubject,
};


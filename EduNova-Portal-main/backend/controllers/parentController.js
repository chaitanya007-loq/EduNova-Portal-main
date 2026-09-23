const parentService = require('../services/parentService');

/**
 * @desc    Get linked child's real-time progress and stats
 * @route   GET /api/parents/child-overview
 * @access  Private (PARENT)
 */
const getChildOverview = async (req, res) => {
  try {
    const overview = await parentService.getChildOverview(req.user.id);
    res.json({
      success: true,
      message: `Child overview for ${overview.student.name} retrieved successfully`,
      data: overview,
    });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = { getChildOverview };

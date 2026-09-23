const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// @route   GET /api/skills
router.get('/', (req, res) => {
  // TODO: Implement skill listing & exchange
  res.json({ success: true, message: 'Skills route - to be implemented' });
});

module.exports = router;

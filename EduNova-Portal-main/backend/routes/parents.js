const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { getChildOverview } = require('../controllers/parentController');

// ── Parent Protection ─────────────────────────────────────────────────────────
router.use(requireAuth);
router.use(requireRole('PARENT'));

// ── Routes ───────────────────────────────────────────────────────────────────
router.get('/child-overview', getChildOverview);

module.exports = router;

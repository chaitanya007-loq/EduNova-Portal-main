/**
 * EduNova Peer Skill Exchange Routes
 * Base path: /api/exchanges
 */

const express = require('express');
const router = express.Router();
const skillExchangeController = require('../controllers/skillExchangeController');
const { requireAuth } = require('../middleware/auth');

// All skill exchange routes require authentication
router.use(requireAuth);

// GET /api/exchanges - List current user's sent and received proposals
router.get('/', skillExchangeController.getUserExchanges);

// GET /api/exchanges/:id - Exchange proposal details
router.get('/:id', skillExchangeController.getExchangeById);

// POST /api/exchanges/request - Create a skill swap proposal between two learners
router.post('/request', skillExchangeController.createExchangeRequest);

// PATCH /api/exchanges/:id/status - Accept/reject proposal (auto-provisions room if accepted)
router.patch('/:id/status', skillExchangeController.updateExchangeStatus);

module.exports = router;

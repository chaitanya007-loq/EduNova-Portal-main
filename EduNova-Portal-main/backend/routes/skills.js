const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const skillController = require('../controllers/skillController');

router.use(requireAuth);
router.get('/dna', skillController.getSkillDna);
router.get('/marketplace', skillController.getMarketplace);

module.exports = router;

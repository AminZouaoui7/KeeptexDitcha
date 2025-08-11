const express = require('express');
const router = express.Router();
const { getMonthlyPerformance } = require('../controllers/performanceController');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/performance
 * @desc    Récupère les statistiques de performance mensuelle par employé
 * @access  Private (JWT required)
 * @query   month - Format YYYY-MM (ex: 2024-01)
 */
router.get('/', protect, getMonthlyPerformance);

module.exports = router;
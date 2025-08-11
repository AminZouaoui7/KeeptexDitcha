const express = require('express');
const router = express.Router();
const {
  upsertAttendance,
  getAttendanceByDate,
  getRoster,
  bulkUpsert,
  seedDayAbsent,
  getMonthlyAttendanceStats,
  getEmployeeStats,
  getEmployeesWithStats
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
const { normalizeStatus } = require('../middleware/attendanceValidation');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes existantes
router.route('/')
  .get(getAttendanceByDate)
  .post(normalizeStatus, upsertAttendance);

// Nouvelles routes pour le pointage d'équipe
router.get('/roster', authorize('admin'), getRoster);
router.post('/bulk', authorize('admin'), bulkUpsert);
router.post('/seed-absent', authorize('admin'), seedDayAbsent);

// Route pour les statistiques mensuelles de présence
router.get('/stats', getMonthlyAttendanceStats);

// Alias route pour les statistiques de performance
router.get('/performance', getMonthlyAttendanceStats);

// Routes pour les statistiques employés
router.get('/employees/:id/stats', getEmployeeStats);
router.get('/employees', getEmployeesWithStats);

module.exports = router;
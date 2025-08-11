const express = require('express');
const router = express.Router();
const {
  upsertAttendance,
  getAttendanceByDate,
  getRoster,
  bulkUpsert,
  seedDayAbsent
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes existantes
router.route('/')
  .get(getAttendanceByDate)
  .post(upsertAttendance);



// Nouvelles routes pour le pointage d\'équipe
router.get('/roster', authorize('admin'), getRoster);
router.post('/bulk', authorize('admin'), bulkUpsert);
router.post('/seed-absent', authorize('admin'), seedDayAbsent);

module.exports = router;
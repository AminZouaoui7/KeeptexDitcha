const express = require('express');
const {
  createOrUpdateAttendance,
  getAttendanceByDate
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 🔒 Toutes les routes nécessitent une authentification et des privilèges admin
router.use(protect);
router.use(authorize('admin'));

// @route   POST /api/attendance
// @desc    Créer ou mettre à jour une présence
router.post('/', createOrUpdateAttendance);

// @route   GET /api/attendance?date=YYYY-MM-DD
// @desc    Récupérer les présences par date
router.get('/', getAttendanceByDate);

module.exports = router;
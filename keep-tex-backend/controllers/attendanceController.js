const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Create or update attendance record
// @route   POST /api/attendance
// @access  Private/Admin
exports.createOrUpdateAttendance = async (req, res) => {
  try {
    const { employee_id, date, status, check_in, check_out } = req.body;

    // Validation des champs requis
    if (!employee_id || !date || !status) {
      return res.status(400).json({
        success: false,
        error: 'Les champs employee_id, date et status sont requis'
      });
    }

    // Vérifier que l'employé existe et est bien un employé
    const employee = await User.findOne({
      where: { id: employee_id, role: 'employee' }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employé non trouvé ou n\'est pas un employé'
      });
    }

    // Validation du format de date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Format de date invalide. Utilisez YYYY-MM-DD'
      });
    }

    // Validation du status
    if (!['Présent', 'Absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Le status doit être "Présent" ou "Absent"'
      });
    }

    // Créer ou mettre à jour l'enregistrement
    const [attendance, created] = await Attendance.upsert({
      employee_id,
      date,
      status,
      check_in: check_in || null,
      check_out: check_out || null
    });

    res.status(created ? 201 : 200).json({
      success: true,
      message: created ? 'Présence créée avec succès' : 'Présence mise à jour avec succès',
      data: attendance
    });

  } catch (error) {
    console.error('Erreur lors de la création/mise à jour de la présence:', error);
    
    // Gestion des erreurs de contrainte unique
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Une présence existe déjà pour cet employé à cette date'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la création/mise à jour de la présence'
    });
  }
};

// @desc    Get attendance records by date
// @route   GET /api/attendance?date=YYYY-MM-DD
// @access  Private/Admin
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre date est requis (format: YYYY-MM-DD)'
      });
    }

    // Validation du format de date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Format de date invalide. Utilisez YYYY-MM-DD'
      });
    }

    // Récupérer les présences avec les informations de l'employé
    const attendances = await Attendance.findAll({
      where: { date },
      include: [
        {
          model: User,
          as: 'employee',
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: attendances.length,
      data: attendances
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des présences:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des présences'
    });
  }
};
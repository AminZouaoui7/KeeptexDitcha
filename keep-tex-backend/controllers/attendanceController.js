const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { Op } = require('sequelize');
const sequelize = require('../sequelize');
const { QueryTypes } = require('sequelize');

// UPSERT - Créer ou mettre à jour un pointage
const upsertAttendance = async (req, res) => {
  try {
    const { userId, date, status, checkIn, checkOut, notes } = req.body;

    // Validation des données
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Le champ userId est requis'
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Le champ date est requis'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Le champ status est requis'
      });
    }

    // Vérifier que l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Validation du format de date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide. Utilisez YYYY-MM-DD'
      });
    }

    // Validation du statut (middleware already handles this)
    const validStatuses = ['present', 'absent', 'conge'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: present, absent, conge'
      });
    }

    // Validation des heures si fournies
    if (checkIn) {
      const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
      if (!timeRegex.test(checkIn)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'heure invalide pour checkIn. Utilisez HH:mm:ss'
        });
      }
    }

    if (checkOut) {
      const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
      if (!timeRegex.test(checkOut)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'heure invalide pour checkOut. Utilisez HH:mm:ss'
        });
      }
    }

    // Préparation des données
    const attendanceData = {
      user_id: userId,
      date: date,
      status: status,
      check_in: checkIn || null,
      check_out: checkOut || null,
      notes: notes || null
    };

    // Utilisation de upsert avec la contrainte unique
    const [attendance, created] = await Attendance.upsert(attendanceData, {
      conflictFields: ['user_id', 'date']
    });

    res.status(created ? 201 : 200).json({
      success: true,
      message: created ? 'Pointage créé avec succès' : 'Pointage mis à jour avec succès',
      data: attendance
    });

  } catch (error) {
    console.error('Erreur lors de la création/mise à jour du pointage:', error);
    
    // Gestion spécifique des erreurs de contrainte unique
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Un pointage existe déjà pour cet utilisateur à cette date'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création/mise à jour du pointage',
      error: error.message
    });
  }
};

// Récupérer les pointages par date
const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre date est requis (format: YYYY-MM-DD)'
      });
    }

    // Validation du format de date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide. Utilisez YYYY-MM-DD'
      });
    }

    const attendances = await Attendance.findAll({
      where: { date: date },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
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
    console.error('Erreur lors de la récupération des pointages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des pointages',
      error: error.message
    });
  }
};

/**
 * Récupère les statistiques mensuelles de présence par employé - VERSION ROBUSTE
 * @route GET /api/attendance/stats
 * @param {string} month - Mois au format YYYY-MM (query parameter)
 * @returns {Object} Statistiques de présence par employé
 */




/**
 * Récupère la liste des utilisateurs actifs avec leur pointage pour une date donnée
 * @route GET /api/attendance/roster
 * @param {string} date - Date au format YYYY-MM-DD (query parameter)
 * @returns {Object} Liste des utilisateurs avec leur pointage
 */
const getRoster = async (req, res) => {
  try {
    const { date } = req.query;

    // Validation de la date
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre date est requis (format: YYYY-MM-DD)'
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide. Utilisez YYYY-MM-DD'
      });
    }

    // Requête SQL optimisée avec LEFT JOIN
    const query = `
      SELECT 
        u.id as "userId",
        COALESCE(u.name, u.email) as "name",
        u.email,
        a.status,
        a.check_in as "checkIn",
        a.check_out as "checkOut",
        a.notes
      FROM users u
      LEFT JOIN attendances a ON u.id = a.user_id AND a.date = :date
      WHERE u.is_active = TRUE
      ORDER BY COALESCE(u.name, u.email) ASC
    `;

    const roster = await sequelize.query(query, {
      replacements: { date },
      type: sequelize.QueryTypes.SELECT
    });

    res.status(200).json({
      success: true,
      count: roster.length,
      date,
      data: roster
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du roster:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du roster',
      error: error.message
    });
  }
};

/**
 * Crée ou met à jour plusieurs pointages en une seule requête
 * @route POST /api/attendance/bulk
 * @param {string} date - Date au format YYYY-MM-DD
 * @param {Array} records - Tableau des enregistrements de pointage
 * @returns {Object} Confirmation de l\'enregistrement
 */
const bulkUpsert = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { date, records } = req.body;

    // Validation des données
    if (!date) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le champ date est requis'
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide. Utilisez YYYY-MM-DD'
      });
    }

    if (!Array.isArray(records)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le champ records doit être un tableau'
      });
    }

    if (records.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le tableau records ne peut pas être vide'
      });
    }

    // Validation des statuts (middleware already handles this)
    const validStatuses = ['present', 'absent', 'conge'];
    const cleanRecords = [];

    for (const record of records) {
      if (!record.userId) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Each record must have a userId'
        });
      }

      if (!record.status) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Each record must have a status'
        });
      }

      if (!validStatuses.includes(record.status)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Invalid status: ${record.status}. Allowed values: present, absent, conge`
        });
      }

      cleanRecords.push({
        user_id: record.userId,
        date: date,
        status: record.status,
        check_in: record.checkIn || null,
        check_out: record.checkOut || null,
        notes: record.notes || null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Utilisation de bulkCreate avec upsert
    await Attendance.bulkCreate(cleanRecords, {
      updateOnDuplicate: ['status', 'check_in', 'check_out', 'notes', 'updatedAt'],
      conflictFields: ['user_id', 'date'],
      transaction
    });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Pointage enregistré'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Erreur lors du bulk upsert:', error);
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Un ou plusieurs userId sont invalides'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement du pointage',
      error: error.message
    });
  }
};

/**
 * Initialise tous les utilisateurs actifs comme absents pour une date donnée
 * @route POST /api/attendance/seed-absent
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {Object} Confirmation de l\'initialisation
 */
const seedDayAbsent = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { date } = req.body;

    // Validation de la date
    if (!date) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Le champ date est requis'
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Format de date invalide. Utilisez YYYY-MM-DD'
      });
    }

    // Récupérer tous les utilisateurs actifs
    const activeUsers = await User.findAll({
      where: { is_active: true },
      attributes: ['id'],
      transaction
    });

    // Créer les enregistrements absents
    const absentRecords = activeUsers.map(user => ({
      user_id: user.id,
      date: date,
      status: 'absent',
      check_in: null,
      check_out: null,
      notes: 'Initialisé comme absent',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Utilisation de bulkCreate avec ON CONFLICT DO NOTHING
    await Attendance.bulkCreate(absentRecords, {
      updateOnDuplicate: [], // Ne rien mettre à jour en cas de conflit
      ignoreDuplicates: true, // PostgreSQL: ON CONFLICT DO NOTHING
      transaction
    });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Initialisation des absences effectuée',
      count: activeUsers.length
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Erreur lors de l\'initialisation des absences:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'initialisation',
      error: error.message
    });
  }
};

/**
 * Récupère les statistiques mensuelles de présence par employé
 * @route GET /api/attendance/stats
 * @route GET /api/performance
 * @param {string} month - Mois au format YYYY-MM (query parameter)
 * @returns {Object} Statistiques de présence par employé
 */
const getMonthlyAttendanceStats = async (req, res) => {
  try {
    const { month } = req.query;

    // Validation du format month avec regex
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!month || !monthRegex.test(month)) {
      return res.status(400).json({ 
        success: false, 
        message: 'month must be YYYY-MM' 
      });
    }

    // Construction des dates UTC
    const [y, m] = month.split('-').map(Number);
    const startDate = new Date(Date.UTC(y, m - 1, 1));
    const endDate = new Date(Date.UTC(y, m, 1));

    const query = `
      SELECT 
        u.id::text AS "userId",
        COALESCE(u.name, u.email) AS "user_name",
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::int AS present,
        SUM(CASE WHEN a.status = 'absent'  THEN 1 ELSE 0 END)::int AS absent,
        SUM(CASE WHEN a.status = 'conge'   THEN 1 ELSE 0 END)::int AS conge
      FROM users u
      LEFT JOIN attendance a
        ON u.id = COALESCE(a.user_id, a."userId")
       AND a.date >= :start AND a.date < :end
      WHERE u.role = 'employee'
      GROUP BY u.id, u.name, u.email
      ORDER BY "user_name"
    `;

    const results = await sequelize.query(query, {
      replacements: { start: startDate, end: endDate },
      type: sequelize.QueryTypes.SELECT
    });

    console.info(`[STATS] month=${month} start=${startDate.toISOString()} end=${endDate.toISOString()} rows=${results.length}`);

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('[STATS] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics'
    });
  }
};

/**
 * Récupère les statistiques de présence d'un employé sur une période donnée
 * @route GET /api/employees/:id/stats
 * @param {string} from - Date de début (YYYY-MM-DD)
 * @param {string} to - Date de fin (YYYY-MM-DD)
 * @returns {Object} Statistiques de présence {presents, absents, conges}
 */
const getEmployeeStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;

    // Validation de l'utilisateur
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Validation des dates
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!from || !to || !dateRegex.test(from) || !dateRegex.test(to)) {
      return res.status(400).json({
        success: false,
        message: 'from and to must be YYYY-MM-DD'
      });
    }

    const query = `
      SELECT 
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END)::int AS presents,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END)::int AS absents,
        SUM(CASE WHEN status = 'conge' THEN 1 ELSE 0 END)::int AS conges
      FROM attendance
      WHERE user_id = :userId 
        AND date >= :from 
        AND date <= :to
    `;

    const [stats] = await sequelize.query(query, {
      replacements: { userId: id, from, to },
      type: sequelize.QueryTypes.SELECT
    });

    // Ensure 0 values when no rows exist
    const result = {
      presents: stats.presents || 0,
      absents: stats.absents || 0,
      conges: stats.conges || 0
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error getting employee stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee statistics'
    });
  }
};

/**
 * Récupère tous les employés avec leurs statistiques agrégées
 * @route GET /api/employees
 * @returns {Array} Liste des employés avec présent_j, absent_j, conge_j
 */
const getEmployeesWithStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        COALESCE(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END), 0)::int AS present_j,
        COALESCE(SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END), 0)::int AS absent_j,
        COALESCE(SUM(CASE WHEN a.status = 'conge' THEN 1 ELSE 0 END), 0)::int AS conge_j
      FROM users u
      LEFT JOIN attendance a ON u.id = a.user_id
      WHERE u.role = 'employee'
      GROUP BY u.id, u.name, u.email, u.role
      ORDER BY u.name
    `;

    const employees = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      count: employees.length,
      data: employees
    });

  } catch (error) {
    console.error('Error getting employees with stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employees with statistics'
    });
  }
};

module.exports = {
  upsertAttendance,
  getAttendanceByDate,
  getRoster,
  bulkUpsert,
  seedDayAbsent,
  getMonthlyAttendanceStats,
  getEmployeeStats,
  getEmployeesWithStats
};
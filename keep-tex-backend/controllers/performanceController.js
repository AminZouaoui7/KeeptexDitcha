const { QueryTypes } = require('sequelize');
const sequelize = require('../sequelize');

/**
 * Récupère les statistiques de performance mensuelle par employé
 * @route GET /api/performance
 * @param {string} month - Mois au format YYYY-MM (query parameter)
 * @returns {Object} Performance data with present days, hourly rate, and salary calculation
 */
const getMonthlyPerformance = async (req, res) => {
  try {
    const { month } = req.query;
    
    // Validation du format du mois
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Paramètre month invalide. Format YYYY-MM (ex: 2024-01)' 
      });
    }

    // Calcul de la fenêtre de dates robuste
    const [year, monthNum] = month.split('-');
    const startDate = new Date(`${year}-${monthNum}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);

    console.log(`[PERFORMANCE] month=${month}, start=${startDate.toISOString()}, end=${endDate.toISOString()}`);

    // Requête SQL optimisée avec agrégation
    const query = `
      SELECT 
        u.id::text AS "userId",
        COALESCE(u.name, u.email) AS "user_name",
        COUNT(DISTINCT a.date)::int AS present_days,
        COALESCE(u.salaire_h, 0)::float8 AS salaire_h,
        (COUNT(DISTINCT a.date) * COALESCE(u.salaire_h, 0) * 8)::float8 AS salary_amount
      FROM users u
      LEFT JOIN attendances a 
        ON a.user_id = u.id 
        AND a.status = 'present'
        AND a.date >= :start AND a.date < :end
      GROUP BY u.id, u.name, u.email, u.salaire_h
      ORDER BY "user_name" ASC;
    `;

    const results = await sequelize.query(query, {
      replacements: { start: startDate, end: endDate },
      type: QueryTypes.SELECT
    });

    // Calcul du total global
    const total_amount = results.reduce((sum, row) => sum + parseFloat(row.salary_amount || 0), 0);

    return res.status(200).json({
      success: true,
      month: month,
      data: results,
      total_amount: parseFloat(total_amount.toFixed(2))
    });

  } catch (error) {
    console.error('[PERFORMANCE] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des performances',
      error: error.message
    });
  }
};

module.exports = {
  getMonthlyPerformance
};
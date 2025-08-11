const User = require('../models/User');

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Rechercher l'utilisateur avec le rôle 'employee'
    const employee = await User.findOne({
      where: {
        id,
        role: 'employee'
      },
      attributes: ['name', 'cin', 'salaire_h', 'etat']
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employé introuvable"
      });
    }

    // Retourner les données spécifiques
    res.json({
      nom: employee.name,
      cin: employee.cin,
      salaire_h: employee.salaire_h,
      etat: employee.etat
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'employé:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération de l'employé"
    });
  }
};

module.exports = {
  getEmployeeById
};
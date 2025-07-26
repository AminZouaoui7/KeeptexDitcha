const userService = require('../services/UserService');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Get all clients
// @route   GET /api/users/clients
// @access  Private/Admin
exports.getClients = async (req, res) => {
  try {
    const clients = await userService.getAllClients();
    
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Get all employees
// @route   GET /api/users/employees
// @access  Private/Admin
exports.getEmployees = async (req, res) => {
  try {
    const employees = await userService.getAllEmployees();
    
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Get all admins
// @route   GET /api/users/admins
// @access  Private/Admin
exports.getAdmins = async (req, res) => {
  try {
    const admins = await userService.getAllAdmins();
    
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Cet email est déjà utilisé'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erreur serveur'
      });
    }
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    let user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    user = await userService.updateUser(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    await userService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Change user password
// @route   PUT /api/users/:id/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir l\'ancien et le nouveau mot de passe'
      });
    }

    // Vérifier que l'utilisateur modifie son propre mot de passe ou est admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé à modifier ce mot de passe'
      });
    }

    const result = await userService.changePassword(req.params.id, oldPassword, newPassword);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};
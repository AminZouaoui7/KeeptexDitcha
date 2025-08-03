const userService = require('../services/UserService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Request email confirmation code
// @route   POST /api/users/request-email-confirmation
// @access  Private
exports.requestEmailConfirmation = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Veuillez fournir une adresse email' });
    }
    
    // Générer un code de confirmation
    const confirmationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    // Stocker temporairement le code dans la session de l'utilisateur
    req.user.tempEmailConfirmationCode = confirmationCode;
    req.user.tempEmail = email;
    await userService.updateUser(req.user.id, { 
      tempEmailConfirmationCode: confirmationCode,
      tempEmail: email 
    });
    
    // Envoyer l'email de confirmation
    const message = `<h1>Confirmation de votre adresse email</h1>
    <p>Votre code de confirmation est : <strong>${confirmationCode}</strong></p>
    <p>Veuillez saisir ce code dans votre profil pour confirmer votre adresse email.</p>`;
    
    await sendEmail({
      email: email,
      subject: 'Confirmation de votre adresse email',
      message: message
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Un code de confirmation a été envoyé à votre adresse email' 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    // Autoriser uniquement les clients
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        error: 'Accès interdit : seuls les clients peuvent modifier leur profil via cette route'
      });
    }

    // Vérifier que l’utilisateur modifie bien son propre profil
    if (req.user.id !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à modifier ce profil'
      });
    }

    // Gestion de la confirmation d'email
    if (req.body.emailConfirmationCode) {
      if (user.tempEmailConfirmationCode && req.body.emailConfirmationCode === user.tempEmailConfirmationCode) {
        req.body.email = user.tempEmail;
        req.body.emailConfirmed = true;
        req.body.emailConfirmationCode = null;
        req.body.tempEmailConfirmationCode = null;
        req.body.tempEmail = null;
      } else if (req.body.emailConfirmationCode === user.emailConfirmationCode) {
        req.body.emailConfirmed = true;
        req.body.emailConfirmationCode = null;
      } else {
        return res.status(400).json({ success: false, error: 'Code de confirmation invalide' });
      }
    }

    // Si l'email est modifié sans code de confirmation
    if (req.body.email && req.body.email !== user.email && !req.body.emailConfirmationCode) {
      if (req.body.email === user.tempEmail) {
        return res.status(400).json({
          success: false,
          error: 'Veuillez confirmer votre nouvelle adresse email avec le code de confirmation'
        });
      }

      const confirmationCode = require('crypto').randomBytes(3).toString('hex').toUpperCase();
      req.body.tempEmail = req.body.email;
      req.body.tempEmailConfirmationCode = confirmationCode;
      req.body.email = user.email;

      const message = `
        <h1>Confirmation de votre adresse email</h1>
        <p>Votre code de confirmation est : <strong>${confirmationCode}</strong></p>
        <p>Veuillez saisir ce code dans votre profil pour confirmer votre adresse email.</p>
      `;

      const sendEmail = require('../utils/sendEmail');
      await sendEmail({
        email: req.body.tempEmail,
        subject: 'Confirmation de votre adresse email',
        message: message
      });
    }

    const updatedUser = await userService.updateUser(req.user.id, req.body);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
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
    // Conversion en string pour assurer la comparaison correcte
    if (req.params.id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
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

// @desc    Add employee
// @route   POST /api/users/add-employee
// @access  Private/Admin
exports.addEmployee = async (req, res) => {
  try {
    // Récupérer le nom depuis le corps de la requête
    const { name } = req.body;
    
    // Vérifier que le nom est fourni
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Le nom est requis'
      });
    }
    
    // Générer un email temporaire unique
    const email = `${Date.now()}@keeptemp.com`;
    
    // Mot de passe par défaut
    const defaultPassword = 'Keeptemp@123';
    
    // Créer l'objet utilisateur avec les champs requis et optionnels
    const userData = {
      name,
      email,
      password: defaultPassword,
      role: 'employee',
      emailConfirmed: false,
      // Champs optionnels
      num: req.body.num || null,
      etat: req.body.etat === 'Déclaré(e)' ? 'Déclaré(e)' : (req.body.etat === 'Non Déclaré(e)' ? 'Non Déclaré(e)' : null),
      salaire_h: req.body.salaire_h || null,
      cin: req.body.cin || null
    };
    
    // Créer l'utilisateur
    const user = await userService.createUser(userData);
    
    res.status(201).json({
      success: true,
      message: 'Employé ajouté avec succès',
      data: user
    });
  } catch (err) {
    console.error('Erreur lors de l\'ajout d\'un employé:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'ajout de l\'employé'
    });
  }
};
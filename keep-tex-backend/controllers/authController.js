const User = require('../models/User');
const userService = require('../services/UserService');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const sequelize = require('../sequelize');

// Stockage temporaire des utilisateurs en attente de confirmation d'email
const pendingUsers = new Map();

// @desc    Verify email before registration
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir une adresse email'
      });
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Cet email est déjà utilisé'
      });
    }

    // Générer un code de confirmation
    const confirmationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Stocker le code temporairement (avec une expiration de 10 minutes)
    pendingUsers.set(email, {
      code: confirmationCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Envoyer l'email de confirmation
    const message = `<h1>Confirmation de votre adresse email</h1>
    <p>Votre code de confirmation est : <strong>${confirmationCode}</strong></p>
    <p>Ce code expirera dans 10 minutes.</p>`;

    await sendEmail({
      email: email,
      subject: 'Confirmation de votre adresse email',
      message: message
    });

    res.status(200).json({
      success: true,
      message: 'Un code de confirmation a été envoyé à votre adresse email'
    });
  } catch (err) {
    console.error('Erreur lors de la vérification de l\'email:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, emailConfirmationCode, ...userData } = req.body;

    // Vérifier si le code de confirmation est valide
    const pendingUser = pendingUsers.get(email);
    if (!pendingUser || pendingUser.code !== emailConfirmationCode) {
      return res.status(400).json({
        success: false,
        error: 'Code de confirmation invalide ou expiré'
      });
    }

    // Vérifier si le code n'a pas expiré
    if (pendingUser.expires < Date.now()) {
      pendingUsers.delete(email);
      return res.status(400).json({
        success: false,
        error: 'Le code de confirmation a expiré'
      });
    }

    // Supprimer l'entrée temporaire
    pendingUsers.delete(email);

    // Créer l'utilisateur avec l'email confirmé
    const user = await userService.createUser({
      ...userData,
      email,
      emailConfirmed: true
    });

    sendTokenResponse(user, 201, res);
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Convertir l'email en minuscules pour éviter les problèmes de casse
    const normalizedEmail = email.toLowerCase();
    console.log('Normalized email:', normalizedEmail);

    // Check for user using UserService
    const user = await userService.getUserByEmail(normalizedEmail);
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found with email:', normalizedEmail);
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    // Check if password matches
    console.log('Checking password match...');
    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password does not match for user:', normalizedEmail);
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    console.log('Login successful for user:', normalizedEmail);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    console.log('getMe called, req.user:', req.user);
    if (!req.user) {
      console.error('No user in request');
      return res.status(401).json({ success: false, error: 'Utilisateur non authentifié' });
    }
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      console.error('User not found for id:', req.user.id);
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
  });
};

// @desc    Get confirmation code for testing
// @route   GET /api/auth/get-confirmation-code
// @access  Public
exports.getConfirmationCode = (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }
  const pendingUser = pendingUsers.get(email);
  if (!pendingUser) {
    return res.status(404).json({ success: false, error: 'No pending confirmation code found for this email' });
  }
  res.status(200).json({ success: true, code: pendingUser.code });
};

// @desc    Test login route
// @route   POST /api/auth/test-login
// @access  Public
exports.testLogin = async (req, res) => {
  try {
    console.log('Test login attempt:', req.body);
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      console.log('Test login: Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Convertir l'email en minuscules
    const normalizedEmail = email.toLowerCase();
    console.log('Test login: Normalized email:', normalizedEmail);

    // Vérifier si l'utilisateur existe directement dans la base de données
    const [users] = await sequelize.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER('${normalizedEmail}')`
    );
    console.log('Test login: Raw DB query result:', users);

    if (users.length === 0) {
      console.log('Test login: User not found in database');
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    const user = users[0];
    console.log('Test login: User found:', user.email);

    // Vérifier le mot de passe avec bcrypt directement
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Test login: Password match result:', isMatch);

    if (!isMatch) {
      console.log('Test login: Password does not match');
      return res.status(401).json({
        success: false,
        error: 'Mot de passe incorrect'
      });
    }

    console.log('Test login: Login successful');
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Test login error:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
      details: err.message
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Préparer les données utilisateur sans le mot de passe
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};
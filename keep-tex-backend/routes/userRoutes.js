const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getClients,
  getEmployees,
  getAdmins,
  requestEmailConfirmation,
  addEmployee
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes non protégées
router.post('/add-employee', addEmployee);

// Protéger toutes les autres routes
router.use(protect);

// Routes accessibles uniquement aux administrateurs
router
  .route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

// Routes pour les différents types d'utilisateurs
router.get('/clients', authorize('admin'), getClients);
router.get('/employees', authorize('admin'), getEmployees);
router.get('/admins', authorize('admin'), getAdmins);

router
  .route('/:id')
  .get(authorize('admin'), getUser)
  .put(async (req, res, next) => {
    if (req.user.role === 'admin' || req.user.id.toString() === req.params.id.toString()) {
      return updateUser(req, res, next);
    } else {
      return res.status(403).json({ success: false, error: "Vous n\'êtes pas autorisé à modifier ce profil" });
    }
  })
  .delete(authorize('admin'), deleteUser);

// Route pour changer le mot de passe (accessible à l'utilisateur lui-même ou à un admin)
router.put('/:id/password', changePassword);

// Route pour demander un code de confirmation d'email
router.post('/request-email-confirmation', requestEmailConfirmation);



// Route pour mettre à jour le profil utilisateur (accessible à l'utilisateur lui-même)
router.put('/profile', async (req, res, next) => {
  return updateProfile(req, res, next);
});

// Route pour changer le mot de passe (accessible à l'utilisateur lui-même)
router.put('/change-password', async (req, res, next) => {
  // Utiliser l'ID de l'utilisateur connecté pour le changement de mot de passe
  req.params.id = req.user.id;
  return changePassword(req, res, next);
});

module.exports = router;
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
  getAdmins
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protéger toutes les routes
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
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

// Route pour changer le mot de passe (accessible à l'utilisateur lui-même ou à un admin)
router.put('/:id/password', changePassword);

module.exports = router;
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
  addEmployee,
  updateProfile // ⚠️ Ajouté ici si tu l'as dans le controller
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();


// 🔓 Routes non protégées (publics)
router.post('/add-employee', addEmployee);
router.post('/request-email-confirmation', requestEmailConfirmation);


// 🔒 Middleware pour protéger toutes les routes suivantes
router.use(protect);


// 🔐 Routes accessibles uniquement aux administrateurs
router.get('/clients', authorize('admin'), getClients);
router.get('/employees', authorize('admin'), getEmployees);
router.get('/admins', authorize('admin'), getAdmins);


// 👥 Routes REST principales
router.route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);


// 👤 Routes individuelles utilisateur (GET/PUT/DELETE)
router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(async (req, res, next) => {
    // Un admin ou l'utilisateur lui-même peut mettre à jour son profil
    if (req.user.role === 'admin' || req.user.id.toString() === req.params.id.toString()) {
      return updateUser(req, res, next);
    } else {
      return res.status(403).json({ success: false, error: "Vous n'êtes pas autorisé à modifier ce profil" });
    }
  })
  .delete(authorize('admin'), deleteUser);


// 🔐 Changement de mot de passe pour un utilisateur (par admin ou soi-même)
router.put('/:id/password', changePassword);





// 👤 Pour l'utilisateur connecté (update profil et mot de passe)
router.put('/profile', updateProfile);

router.put('/change-password', (req, res, next) => {
  req.params.id = req.user.id;
  return changePassword(req, res, next);
});


module.exports = router;

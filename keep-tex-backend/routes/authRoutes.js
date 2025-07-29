const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  verifyEmail,
  getConfirmationCode
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/verify-email', verifyEmail);
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.get('/get-confirmation-code', getConfirmationCode);

module.exports = router;
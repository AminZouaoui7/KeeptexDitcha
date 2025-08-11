const express = require('express');
const { getEmployeeById } = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', protect, getEmployeeById);

module.exports = router;
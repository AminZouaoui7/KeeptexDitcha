const express = require('express');
const {
  submitContact,
  getContacts,
  getContact,
  markAsRead,
  deleteContact
} = require('../controllers/contactControllerPg');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(submitContact)
  .get(protect, authorize('admin'), getContacts);

router
  .route('/:id')
  .get(protect, authorize('admin'), getContact)
  .delete(protect, authorize('admin'), deleteContact);

router.route('/:id/read').put(protect, authorize('admin'), markAsRead);

module.exports = router;
const express = require('express');
const {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  getFeedbacksByUserId,
  updateFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getAllFeedbacks)
  .post(protect, createFeedback);

router.route('/user/:userId')
  .get(protect, getFeedbacksByUserId);

router.route('/:id')
  .get(protect, authorize('admin'), getFeedbackById)
  .put(protect, updateFeedback)
  .delete(protect, deleteFeedback);

module.exports = router;
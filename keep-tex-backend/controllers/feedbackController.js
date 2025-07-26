const feedbackService = require('../services/FeedbackService');

// @desc    Create new feedback
// @route   POST /api/feedbacks
// @access  Private
exports.createFeedback = async (req, res) => {
  try {
    // Add userId from authenticated user
    const feedbackData = {
      ...req.body,
      userId: req.user.id
    };
    
    const feedback = await feedbackService.createFeedback(feedbackData);
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Private/Admin
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedbacks/:id
// @access  Private/Admin
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await feedbackService.getFeedbackById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get feedbacks by user ID
// @route   GET /api/feedbacks/user/:userId
// @access  Private
exports.getFeedbacksByUserId = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getFeedbacksByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update feedback
// @route   PUT /api/feedbacks/:id
// @access  Private
exports.updateFeedback = async (req, res) => {
  try {
    const updatedFeedback = await feedbackService.updateFeedback(req.params.id, req.body);
    if (!updatedFeedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.status(200).json({ success: true, data: updatedFeedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedbacks/:id
// @access  Private
exports.deleteFeedback = async (req, res) => {
  try {
    const deleted = await feedbackService.deleteFeedback(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
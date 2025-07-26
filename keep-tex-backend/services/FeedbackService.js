const feedbackRepository = require('../repositories/FeedbackRepository');

class FeedbackService {
  async createFeedback(feedbackData) {
    return await feedbackRepository.create(feedbackData);
  }

  async getFeedbackById(id) {
    return await feedbackRepository.findById(id);
  }

  async getAllFeedbacks() {
    return await feedbackRepository.findAll();
  }
  
  async getFeedbacksByUserId(userId) {
    return await feedbackRepository.findByUserId(userId);
  }

  async updateFeedback(id, updateData) {
    return await feedbackRepository.update(id, updateData);
  }

  async deleteFeedback(id) {
    return await feedbackRepository.delete(id);
  }
}

module.exports = new FeedbackService();
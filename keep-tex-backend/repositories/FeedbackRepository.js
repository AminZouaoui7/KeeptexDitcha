const { Feedback } = require('../models/customModels');

class FeedbackRepository {
  async create(feedbackData) {
    return await Feedback.create(feedbackData);
  }

  async findById(id) {
    return await Feedback.findByPk(id);
  }

  async findAll() {
    return await Feedback.findAll();
  }

  async update(id, updateData) {
    const feedback = await Feedback.findByPk(id);
    if (!feedback) return null;
    return await feedback.update(updateData);
  }

  async delete(id) {
    const feedback = await Feedback.findByPk(id);
    if (!feedback) return null;
    await feedback.destroy();
    return true;
  }
}

module.exports = new FeedbackRepository();
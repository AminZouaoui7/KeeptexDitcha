const User = require('../models/User');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }
  
  async findByRole(role) {
    return await User.findAll({ where: { role } });
  }

  async findAll() {
    return await User.findAll();
  }

  async update(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(updateData);
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
  }
}

module.exports = new UserRepository();
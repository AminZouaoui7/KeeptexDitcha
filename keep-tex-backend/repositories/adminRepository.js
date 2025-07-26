const { Admin } = require('../models/customModels');

class AdminRepository {
  async create(adminData) {
    return await Admin.create(adminData);
  }

  async findById(id) {
    return await Admin.findByPk(id);
  }

  async findAll() {
    return await Admin.findAll();
  }

  async update(id, updateData) {
    const admin = await Admin.findByPk(id);
    if (!admin) return null;
    return await admin.update(updateData);
  }

  async delete(id) {
    const admin = await Admin.findByPk(id);
    if (!admin) return null;
    await admin.destroy();
    return true;
  }
}

module.exports = new AdminRepository();
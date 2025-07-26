const adminRepository = require('../repositories/AdminRepository');

class AdminService {
  async createAdmin(adminData) {
    return await adminRepository.create(adminData);
  }

  async getAdminById(id) {
    return await adminRepository.findById(id);
  }

  async getAllAdmins() {
    return await adminRepository.findAll();
  }

  async updateAdmin(id, updateData) {
    return await adminRepository.update(id, updateData);
  }

  async deleteAdmin(id) {
    return await adminRepository.delete(id);
  }
}

module.exports = new AdminService();
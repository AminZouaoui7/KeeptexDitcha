const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(userData) {
    return await userRepository.create(userData);
  }

  async getUserById(id) {
    console.log('UserService.getUserById called with id:', id);
    const user = await userRepository.findById(id);
    console.log('UserService.getUserById found user:', user);
    return user;
  }

  async getUserByEmail(email) {
    return await userRepository.findByEmail(email);
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }
  
  // Méthodes spécifiques pour les différents types d'utilisateurs
  async getAllClients() {
    return await userRepository.findByRole('client');
  }
  
  async getAllEmployees() {
    return await userRepository.findByRole('employee');
  }
  
  async getAllAdmins() {
    return await userRepository.findByRole('admin');
  }

  async updateUser(id, updateData) {
    // Si le mot de passe est mis à jour, le hacher
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    return await userRepository.update(id, updateData);
  }

  async deleteUser(id) {
    return await userRepository.delete(id);
  }

  async changePassword(id, oldPassword, newPassword) {
    const user = await userRepository.findById(id);
    if (!user) return { success: false, message: 'Utilisateur non trouvé' };
    
    // Vérifier l'ancien mot de passe
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) return { success: false, message: 'Mot de passe actuel incorrect' };
    
    // Mettre à jour le mot de passe
    return await this.updateUser(id, { password: newPassword });
  }
}

module.exports = new UserService();
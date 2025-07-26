const clientRepository = require('../repositories/ClientRepository');

class ClientService {
  async createClient(clientData) {
    return await clientRepository.create(clientData);
  }

  async getClientById(id) {
    return await clientRepository.findById(id);
  }

  async getAllClients() {
    return await clientRepository.findAll();
  }

  async updateClient(id, updateData) {
    return await clientRepository.update(id, updateData);
  }

  async deleteClient(id) {
    return await clientRepository.delete(id);
  }
}

module.exports = new ClientService();
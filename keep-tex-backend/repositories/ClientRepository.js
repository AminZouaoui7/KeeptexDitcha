const { Client } = require('../models/customModels');

class ClientRepository {
  async create(clientData) {
    return await Client.create(clientData);
  }

  async findById(id) {
    return await Client.findByPk(id);
  }

  async findAll() {
    return await Client.findAll();
  }

  async update(id, updateData) {
    const client = await Client.findByPk(id);
    if (!client) return null;
    return await client.update(updateData);
  }

  async delete(id) {
    const client = await Client.findByPk(id);
    if (!client) return null;
    await client.destroy();
    return true;
  }
}

module.exports = new ClientRepository();
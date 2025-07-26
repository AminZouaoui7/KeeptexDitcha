const { Employee } = require('../models/customModels');

class EmployeeRepository {
  async create(employeeData) {
    return await Employee.create(employeeData);
  }

  async findById(id) {
    return await Employee.findByPk(id);
  }

  async findAll() {
    return await Employee.findAll();
  }

  async update(id, updateData) {
    const employee = await Employee.findByPk(id);
    if (!employee) return null;
    return await employee.update(updateData);
  }

  async delete(id) {
    const employee = await Employee.findByPk(id);
    if (!employee) return null;
    await employee.destroy();
    return true;
  }
}

module.exports = new EmployeeRepository();
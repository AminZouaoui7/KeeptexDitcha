const employeeRepository = require('../repositories/EmployeeRepository');

class EmployeeService {
  async createEmployee(employeeData) {
    return await employeeRepository.create(employeeData);
  }

  async getEmployeeById(id) {
    return await employeeRepository.findById(id);
  }

  async getAllEmployees() {
    return await employeeRepository.findAll();
  }

  async updateEmployee(id, updateData) {
    return await employeeRepository.update(id, updateData);
  }

  async deleteEmployee(id) {
    return await employeeRepository.delete(id);
  }
}

module.exports = new EmployeeService();
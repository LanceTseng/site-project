const Employee = require("../models/Employee");

class EmployeeRepository {
  // Get all employees
  async getAll() {
    return await Employee.findAll();
  }

  // Get employee by ID
  async getById(id) {
    return await Employee.findByPk(id);
  }

  // Get employee by name
  async getByName(firstName, lastName) {
    return await Employee.findOne({
      where: { first_name: firstName, last_name: lastName },
    });
  }

  // Get employee by UserId
  async getByUserId(id) {
    return await Employee.findOne({
      where: { link_user_id: id },
    });
  }

  // Create a new employee
  async create(employeeData) {
    return await Employee.create(employeeData);
  }

  // Update employee by ID
  async update(id, employeeData) {
    await Employee.update(employeeData, { where: { employee_id: id } });
    return this.getById(id); // Return the updated record
  }

  // Delete employee by ID
  async delete(id) {
    return await Employee.destroy({ where: { employee_id: id } });
  }
}

module.exports = new EmployeeRepository();

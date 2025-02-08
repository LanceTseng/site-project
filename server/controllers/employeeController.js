const EmployeeRepository = require('../repositories/employeeRepository');

class EmployeeController {
  // Get all employees
  async getAll(req, res) {
    try {
      const employees = await EmployeeRepository.getAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get employee by ID
  async getById(req, res) {
    try {
      const employee = await EmployeeRepository.getById(req.params.id);
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

    // Get employee by user ID
    async getByUserId(req, res) {
      try {
        const employee = await EmployeeRepository.getByUserId(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.json(employee);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }

  // Get employee by name
  async getByName(req, res) {
    try {
      const { firstName, lastName } = req.query;
      const employee = await EmployeeRepository.getByName(firstName, lastName);
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Create a new employee
  async create(req, res) {
    try {
      const newEmployee = await EmployeeRepository.create(req.body);
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Update employee by ID
  async update(req, res) {
    try {
      const updatedEmployee = await EmployeeRepository.update(req.params.id, req.body);
      if (!updatedEmployee) return res.status(404).json({ error: 'Employee not found' });
      res.json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Delete employee by ID
  async delete(req, res) {
    try {
      const result = await EmployeeRepository.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Employee not found' });
      res.json({ message: 'Employee deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new EmployeeController();

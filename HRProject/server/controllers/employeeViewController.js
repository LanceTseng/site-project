const EmployeeViewRepository = require("../repositories/employeeViewRepository");

class EmployeeViewController {
  async getAllEmployeeView(req, res) {
    try {
      const employees = await EmployeeViewRepository.getAllEmployees();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: "Error fetching employees" });
    }
  }

  async getEmployeeViewById(req, res) {
    try {
      const { id } = req.params;
      const employee = await EmployeeViewRepository.getEmployeeById(id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ error: "Error fetching employee" });
    }
  }
}

// Export an instance of the class
module.exports = new EmployeeViewController();

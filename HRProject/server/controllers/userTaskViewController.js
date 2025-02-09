const UserTaskViewRepository = require("../repositories/userTaskViewRepository");

class UserTaskViewController {
  async getAllUserTaskView(req, res) {
    try {
      const employees = await UserTaskViewRepository.getAllUserTasks();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: "Error fetching employees" });
    }
  }

  async getUserTaskViewById(req, res) {
    try {
      const { id } = req.params;
      const employee = await UserTaskViewRepository.getUserTaskByUserId(id);
      if (!employee) {
        return res.status(404).json({ message: "UserTask not found" });
      }
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ error: "Error fetching employee" });
    }
  }
}

// Export an instance of the class
module.exports = new UserTaskViewController();

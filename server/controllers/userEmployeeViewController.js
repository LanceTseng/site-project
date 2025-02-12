const UserEmployeeViewRepository = require("../repositories/userEmployeeViewRepository");

class UserEmployeeViewController {
  async getAllUserEmployeeView(req, res) {
    try {
      const userEmp = await UserEmployeeViewRepository.getAllUserEmployee();
      res.status(200).json(userEmp);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
    }
  }

  async getUserEmployeeViewByUserId(req, res) {
    try {
      const userEmp = await UserEmployeeViewRepository.getUserEmployeeByUserId(
        req.params.userid
      );
      if (!userEmp) {
        return res.status(404).json({ message: "UserEmployee not found" });
      }
      res.status(200).json(userEmp);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userEmp" });
    }
  }

  async getUserEmployeeViewByEmployeeId(req, res) {
    try {
      const userEmp =
        await UserEmployeeViewRepository.getUserEmployeeByEmployeeId(
          req.params.eid
        );
      if (!userEmp) {
        return res.status(404).json({ message: "User Employee not found" });
      }
      res.status(200).json(userEmp);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userEmp" });
    }
  }

  async getUserEmployeeViewByUsername(req, res) {
    try {
      const userEmp =
        await UserEmployeeViewRepository.getUserEmployeeByUserName(
          req.params.username
        );
      if (!userEmp) {
        return res.status(404).json({ message: "UserEmployee not found" });
      }
      res.status(200).json(userEmp);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userEmp" });
    }
  }

  async getUserEmployeeViewByEmployeeStatus(req, res) {
    try {
      const userEmp =
        await UserEmployeeViewRepository.getUserEmployeeByEmployeeStatus(
          req.params.status
        );
      if (!userEmp) {
        return res.status(404).json({ message: "UserEmployee not found" });
      }
      res.status(200).json(userEmp);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userEmp" });
    }
  }
}

// Export an instance of the class
module.exports = new UserEmployeeViewController();

const UserFormViewRepository = require("../repositories/userFormViewRepository");

class UserFormViewController {
  async getAllUserFormView(req, res) {
    try {
      const userForm = await UserFormViewRepository.getAllUserForm();
      res.status(200).json(userForm);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
    }
  }

  async getUserFormViewByUserId(req, res) {
    try {
      const userForm = await UserFormViewRepository.getUserFormByUserId(
        req.params.userid
      );
      if (!userForm) {
        return res.status(404).json({ message: "UserEmployee not found" });
      }
      res.status(200).json(userForm);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userForm" });
    }
  }
}

// Export an instance of the class
module.exports = new UserFormViewController();

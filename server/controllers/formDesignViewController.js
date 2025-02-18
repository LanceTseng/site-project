const FormDesignViewRepository = require("../repositories/formDesignViewRepository");

class FormDesignViewController {
  async getAllFormDesignView(req, res) {
    try {
      const userForm = await FormDesignViewRepository.getAllFormDesign();
      res.status(200).json(userForm);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
    }
  }

  async getFormDesignViewByFormId(req, res) {
    try {
      console.log(req.params);
      const userForm = await FormDesignViewRepository.getFormDesignByFormId(
        req.params.formdid
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
module.exports = new FormDesignViewController();

const FormDesignViewRepository = require("../repositories/formDesignViewRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class FormDesignViewController {
  async getAllFormDesignView(req, res) {
    try {
      const form = await FormDesignViewRepository.getAllFormDesign();
      res.status(200).json(form);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
      logger.error(error.message);
    }
  }

  async getFormDesignViewByFormId(req, res) {
    try {
      const form = await FormDesignViewRepository.getFormDesignByFormId(
        req.params.formdid
      );
      if (!form) {
        return res.status(404).json({ message: "UserEmployee not found" });
      }
      res.status(200).json(form);
    } catch (error) {
      res.status(500).json({ error: "Error fetching form" });

      logger.error(error.message);
    }
  }

  async getFormDesignViewFormTypeByFormTypeId(req, res) {
    try {
      const form =
        await FormDesignViewRepository.getFormDesignFormTypeByFormTypeId();
      if (!form) {
        return res.status(404).json({ message: "UserEmployee not found" });
      }
      res.status(200).json(form);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userForm" });
      logger.error(error.message);
    }
  }
}

// Export an instance of the class
module.exports = new FormDesignViewController();

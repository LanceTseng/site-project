const formDesignRepo = require("../repositories/formDesignRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class FormDesignController {
  async getAll(req, res) {
    try {
      const forms = await formDesignRepo.getAll();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const form = await formDesignRepo.getById(req.params.id);
      if (!form) return res.status(404).json({ error: "Form not found" });
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getByFormId(req, res) {
    try {
      const form = await formDesignRepo.getByFormId(req.params.id);
      if (!form) return res.status(404).json({ error: "Form not found" });
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async create(req, res) {
    try {
      const newForm = await formDesignRepo.create(req.body);
      res.status(201).json(newForm);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const updatedEquipment = await formDesignRepo.update(
        req.params.id,
        req.body
      );
      if (!updatedEquipment)
        return res.status(404).json({ error: "Form not found" });
      res.json(updatedEquipment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await formDesignRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: "Form not found" });
      res.json({ message: "Form deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }
}

module.exports = new FormDesignController();

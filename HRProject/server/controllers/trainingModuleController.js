const trainingModuleRepo = require("../repositories/trainingModuleRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class TrainingModuleController {
  async getAll(req, res) {
    try {
      const modules = await trainingModuleRepo.getAll();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const module = await trainingModuleRepo.getById(req.params.id);
      if (!module) return res.status(404).json({ error: "Module not found" });
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getByDepartmentId(req, res) {
    try {
      const module = await trainingModuleRepo.getByDepartmentId(req.params.id);
      if (!module) return res.status(404).json({ error: "Module not found" });
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }


  async getByName(req, res) {
    try {
      const module = await trainingModuleRepo.getByName(req.params.name);
      if (!module) return res.status(404).json({ error: "Module not found" });
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async create(req, res) {
    try {
      const newModule = await trainingModuleRepo.create(req.body);
      res.status(201).json(newModule);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const updatedModule = await trainingModuleRepo.update(
        req.params.id,
        req.body
      );
      if (!updatedModule)
        return res.status(404).json({ error: "Module not found" });
      res.json(updatedModule);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await trainingModuleRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: "Module not found" });
      res.json({ message: "Module deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }
}

module.exports = new TrainingModuleController();

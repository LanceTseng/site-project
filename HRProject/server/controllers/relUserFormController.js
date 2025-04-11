const UserFormRepository = require("../repositories/relUserFormRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class RelUserFormController {
  async getAll(req, res) {
    try {
      const tasks = await UserFormRepository.getAll();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const task = await UserFormRepository.getById(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async getByUserId(req, res) {
    try {
      const task = await UserFormRepository.getByUserId(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async create(req, res) {
    try {
      console.log(req.body);
      const newTask = await UserFormRepository.create(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const updatedTask = await UserFormRepository.update(
        req.params.id,
        req.body
      );
      if (!updatedTask)
        return res.status(404).json({ error: "Task not found" });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await UserFormRepository.delete(req.params.id);
      if (!result) return res.status(404).json({ error: "Task not found" });
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }
}

module.exports = new RelUserFormController();

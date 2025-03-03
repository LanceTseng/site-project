const relUserChildTaskRepo = require("../repositories/relUserChildTaskRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class RelUserChildTaskController {
  async getAll(req, res) {
    try {
      const tasks = await relUserChildTaskRepo.getAll();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const task = await relUserChildTaskRepo.getById(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async create(req, res) {
    try {
      const newTask = await relUserChildTaskRepo.create(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const updatedTask = await relUserChildTaskRepo.update(
        req.params.id,
        req.body
      );
      if (!updatedTask)
        return res.status(404).json({ error: "Task not found" });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await relUserChildTaskRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: "Task not found" });
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }
}

module.exports = new RelUserChildTaskController();

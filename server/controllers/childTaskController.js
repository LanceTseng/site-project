const childTaskRepo = require("../repositories/childTaskRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class ChildTaskController {
  // Get all child tasks
  async getAll(req, res) {
    try {
      const tasks = await childTaskRepo.getAll();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  // Get child task by ID
  async getById(req, res) {
    try {
      const task = await childTaskRepo.getById(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  // Get child task by ID
  async getByParentTaskId(req, res) {
    try {
      const task = await childTaskRepo.getByParentTaskId(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  // Create new child task
  async create(req, res) {
    try {
      const newTask = await childTaskRepo.create(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  // Update child task by ID
  async update(req, res) {
    try {
      const updatedTask = await childTaskRepo.update(req.params.id, req.body);
      if (!updatedTask)
        return res.status(404).json({ error: "Task not found" });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  // Delete child task by ID
  async delete(req, res) {
    try {
      const result = await childTaskRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: "Task not found" });
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }
}

module.exports = new ChildTaskController();

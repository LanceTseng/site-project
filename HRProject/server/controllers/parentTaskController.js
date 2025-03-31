const parentTaskRepo = require("../repositories/parentTaskRepository");
const parentTaskViewRepo = require("../repositories/parentTaskViewRespository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class ParentTaskController {
  async getAll(req, res) {
    try {
      const tasks = await parentTaskRepo.getAll();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const task = await parentTaskRepo.getById(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getByGroupId(req, res) {
    try {
      const task = await parentTaskRepo.getByGroupId(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async create(req, res) {
    try {
      const newTask = await parentTaskRepo.create(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const updatedTask = await parentTaskRepo.update(req.params.id, req.body);
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
      const result = await parentTaskRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: "Task not found" });
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getParentTasksViewByCondition(req, res) {
    try {
      const { task_group_id, enabled } = req.query;
      const result = await parentTaskViewRepo.geTrainingModuleViewByCondition(
        task_group_id,enabled
      );
      if (!result) return res.status(404).json({ error: "Task not found" });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }
}

module.exports = new ParentTaskController();

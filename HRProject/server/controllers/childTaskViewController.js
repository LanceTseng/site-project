const childTaskViewConreoller = require("../repositories/childTaskViewRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class UserTaskViewController {
  async getAllChildTask(req, res) {
    try {
      const tasks = await childTaskViewConreoller.getAllChildTask();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getChildTaskById(req, res) {
    try {
      const task = await childTaskViewConreoller.getChildTaskById(
        req.params.id
      );
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getChildTaskByParentId(req, res) {
    try {
      const task = await childTaskViewConreoller.getChildTaskByParentId(
        req.params.id
      );
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }
}

module.exports = new UserTaskViewController();

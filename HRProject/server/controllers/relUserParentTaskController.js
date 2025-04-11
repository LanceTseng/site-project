const relUserParentTaskRepo = require("../repositories/relUserParentTaskRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class RelUserParentTaskController {
  // Get all user-parent task relationships
  async getAll(req, res) {
    try {
      const relUserParentTasks = await relUserParentTaskRepo.getAll();
      res.json(relUserParentTasks);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  // Get relationship by ID
  async getById(req, res) {
    try {
      const relUserParentTask = await relUserParentTaskRepo.getById(
        req.params.id
      );
      if (!relUserParentTask)
        return res.status(404).json({ error: "Relationship not found" });
      res.json(relUserParentTask);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  // Create a new user-parent task relationship
  async create(req, res) {
    try {
      const newRelUserParentTask = await relUserParentTaskRepo.create(req.body);
      res.status(201).json(newRelUserParentTask);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  // Update user-parent task relationship by ID
  async update(req, res) {
    try {
      const updatedRelUserParentTask = await relUserParentTaskRepo.update(
        req.params.id,
        req.body
      );
      if (!updatedRelUserParentTask)
        return res.status(404).json({ error: "Relationship not found" });
      res.json(updatedRelUserParentTask);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  // Delete user-parent task relationship by ID
  async delete(req, res) {
    try {
      const result = await relUserParentTaskRepo.delete(req.params.id);
      if (!result)
        return res.status(404).json({ error: "Relationship not found" });
      res.json({ message: "Relationship deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }
}

module.exports = new RelUserParentTaskController();

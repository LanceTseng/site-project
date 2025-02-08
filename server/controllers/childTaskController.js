const childTaskRepo = require('../repositories/childTaskRepository');

class ChildTaskController {
  // Get all child tasks
  async getAll(req, res) {
    try {
      const tasks = await childTaskRepo.getAll();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get child task by ID
  async getById(req, res) {
    try {
      const task = await childTaskRepo.getById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

    // Get child task by ID
    async getByParentTaskId(req, res) {
      try {
        const task = await childTaskRepo.getByParentTaskId(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }

  // Create new child task
  async create(req, res) {
    try {
      const newTask = await childTaskRepo.create(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Update child task by ID
  async update(req, res) {
    try {
      const updatedTask = await childTaskRepo.update(req.params.id, req.body);
      if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Delete child task by ID
  async delete(req, res) {
    try {
      const result = await childTaskRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Task not found' });
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new ChildTaskController();

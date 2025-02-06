const parentTaskRepo = require('../repositories/parentTaskRepository');

class ParentTaskController {
  async getAll(req, res) {
    try {
      const tasks = await parentTaskRepo.getAll();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getById(req, res) {
    try {
      const task = await parentTaskRepo.getById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async create(req, res) {
    try {
      const newTask = await parentTaskRepo.create(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async update(req, res) {
    try {
      const updatedTask = await parentTaskRepo.update(req.params.id, req.body);
      if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async delete(req, res) {
    try {
      const result = await parentTaskRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Task not found' });
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new ParentTaskController();

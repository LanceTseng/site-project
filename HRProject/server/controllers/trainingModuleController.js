const trainingModuleRepo = require('../repositories/trainingModuleRepository');

class TrainingModuleController {
  async getAll(req, res) {
    try {
      const modules = await trainingModuleRepo.getAll();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getById(req, res) {
    try {
      const module = await trainingModuleRepo.getById(req.params.id);
      if (!module) return res.status(404).json({ error: 'Module not found' });
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getByName(req, res) {
    try {
      const module = await trainingModuleRepo.getByName(req.params.name);
      if (!module) return res.status(404).json({ error: 'Module not found' });
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async create(req, res) {
    try {
      const newModule = await trainingModuleRepo.create(req.body);
      res.status(201).json(newModule);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async update(req, res) {
    try {
      const updatedModule = await trainingModuleRepo.update(req.params.id, req.body);
      if (!updatedModule) return res.status(404).json({ error: 'Module not found' });
      res.json(updatedModule);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async delete(req, res) {
    try {
      const result = await trainingModuleRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Module not found' });
      res.json({ message: 'Module deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new TrainingModuleController();

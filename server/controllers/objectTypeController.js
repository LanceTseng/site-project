const BObjectTypeRepository = require('../repositories/objectTypeRepository');

class BObjectTypeController {
  async getAll(req, res) {
    try {
      const result = await BObjectTypeRepository.getAll();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getById(req, res) {
    try {
      const result = await BObjectTypeRepository.getById(req.params.id);
      if (!result) return res.status(404).json({ error: 'Not found' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getByName(req, res) {
    try { 
      const result = await BObjectTypeRepository.getByName(req.params.name);
      if (!result) return res.status(404).json({ error: 'Not found' });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async create(req, res) {
    try {
      const newObjectType = await BObjectTypeRepository.create(req.body);
      res.status(201).json(newObjectType);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async update(req, res) {
    try {
      const updatedObjectType = await BObjectTypeRepository.update(req.params.id, req.body);
      if (!updatedObjectType) return res.status(404).json({ error: 'Not found' });
      res.json(updatedObjectType);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async delete(req, res) {
    try {
      const result = await BObjectTypeRepository.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new BObjectTypeController();

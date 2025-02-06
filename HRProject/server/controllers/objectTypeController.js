const objectTypeRepo = require('../repositories/objectTypeRepository');

class ObjectTypeController {
  async getAll(req, res) {
    try {
      const objectTypes = await objectTypeRepo.getAll();
      res.json(objectTypes);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getById(req, res) {
    try {
      const objectType = await objectTypeRepo.getById(req.params.id);
      if (!objectType) return res.status(404).json({ error: 'Object type not found' });
      res.json(objectType);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getByName(req, res) {
    try {
      const objectType = await objectTypeRepo.getByName(req.params.name);
      if (!objectType) return res.status(404).json({ error: 'Object type not found' });
      res.json(objectType);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async create(req, res) {
    try {
      const newObjectType = await objectTypeRepo.create(req.body);
      res.status(201).json(newObjectType);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async update(req, res) {
    try {
      const updatedObjectType = await objectTypeRepo.update(req.params.id, req.body);
      if (!updatedObjectType) return res.status(404).json({ error: 'Object type not found' });
      res.json(updatedObjectType);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async delete(req, res) {
    try {
      const result = await objectTypeRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Object type not found' });
      res.json({ message: 'Object type deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new ObjectTypeController();

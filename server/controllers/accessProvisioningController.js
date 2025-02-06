const accessProvisioningRepo = require('../repositories/accessProvisioningRepository');

class AccessProvisioningController {
  async getAll(req, res) {
    try {
      const accessList = await accessProvisioningRepo.getAll();
      res.json(accessList);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getById(req, res) {
    try {
      const access = await accessProvisioningRepo.getById(req.params.id);
      if (!access) return res.status(404).json({ error: 'Access provisioning not found' });
      res.json(access);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getByName(req, res) {
    try {
      const access = await accessProvisioningRepo.getByName(req.params.name);
      if (!access) return res.status(404).json({ error: 'Access provisioning not found' });
      res.json(access);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async create(req, res) {
    try {
      const newAccess = await accessProvisioningRepo.create(req.body);
      res.status(201).json(newAccess);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async update(req, res) {
    try {
      const updatedAccess = await accessProvisioningRepo.update(req.params.id, req.body);
      if (!updatedAccess) return res.status(404).json({ error: 'Access provisioning not found' });
      res.json(updatedAccess);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async delete(req, res) {
    try {
      const result = await accessProvisioningRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Access provisioning not found' });
      res.json({ message: 'Access provisioning deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new AccessProvisioningController();

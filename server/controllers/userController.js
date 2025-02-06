const UserRepository = require('../repositories/userRepository');

class UserController {
  async getAll(req, res) {
    try {
      const users = await UserRepository.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getById(req, res) {
    try {
      const user = await UserRepository.getById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async create(req, res) {
    try {
      const newUser = await UserRepository.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async update(req, res) {
    try {
      const updatedUser = await UserRepository.update(req.params.id, req.body);
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async delete(req, res) {
    try {
      const result = await UserRepository.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new UserController();

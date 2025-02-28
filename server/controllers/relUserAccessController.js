const relUserAccessRepository = require("../repositories/relUseraccessRepository");

class UserAccessController {
  async getAll(req, res) {
    try {
      const userAccesses = await relUserAccessRepository.getAll();
      res.json(userAccesses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user accesses" });
    }
  }

  async getById(req, res) {
    try {
      const { userId, accessId } = req.params;
      const userAccess = await relUserAccessRepository.getById(userId, accessId);
      if (!userAccess) {
        return res.status(404).json({ error: "User access not found" });
      }
      res.json(userAccess);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user access" });
    }
  }

  async create(req, res) {
    try {
      const newUserAccess = await relUserAccessRepository.create(req.body);
      res.status(201).json(newUserAccess);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user access" });
    }
  }

  async update(req, res) {
    try {
      const { userId, accessId } = req.params;
      const updatedUserAccess = await relUserAccessRepository.update(userId, accessId, req.body);
      res.json(updatedUserAccess);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user access" });
    }
  }

  async delete(req, res) {
    try {
      const { userId, accessId } = req.params;
      await UserAccessRepository.delete(userId, accessId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user access" });
    }
  }
}

module.exports = new UserAccessController();

const relUserAccessRepository = require("../repositories/relUseraccessRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class UserAccessController {
  async getAll(req, res) {
    try {
      const userAccesses = await relUserAccessRepository.getAll();
      res.json(userAccesses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user accesses" });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const { userId, accessId } = req.params;
      const userAccess = await relUserAccessRepository.getById(
        userId,
        accessId
      );
      if (!userAccess) {
        return res.status(404).json({ error: "User access not found" });
      }
      res.json(userAccess);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user access" });
      logger.error(error.message);
    }
  }

  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const userAccess = await relUserAccessRepository.getByUserId(userId);
      if (!userAccess) {
        return res.status(404).json({ error: "User access not found" });
      }
      res.json(userAccess);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user access" });
      logger.error(error.message);
    }
  }

  async create(req, res) {
    try {
      const newUserAccess = await relUserAccessRepository.create(req.body);
      res.status(201).json(newUserAccess);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user access" });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const { userId, accessId } = req.params;
      const updatedUserAccess = await relUserAccessRepository.update(
        userId,
        accessId,
        req.body
      );
      res.json(updatedUserAccess);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user access" });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const { userId, accessId } = req.params;
      await UserAccessRepository.delete(userId, accessId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user access" });
      logger.error(error.message);
    }
  }
}

module.exports = new UserAccessController();

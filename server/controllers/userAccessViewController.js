const UserAccessViewRepository = require("../repositories/userAccessViewRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class UserAccessViewController {
  // Get all user access records
  async getAll(req, res) {
    try {
      const data = await UserAccessViewRepository.getAllUserAccess();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user access data." });
      logger.error(error.message);
    }
  }

  // Get user access by user ID
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const data = await UserAccessViewRepository.getUserAccessByUserId(userId);
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch user access by user ID." });
      logger.error(error.message);
    }
  }

  // Get user access by access ID
  async getByAccessId(req, res) {
    try {
      const { accessId } = req.params;
      const data = await UserAccessViewRepository.getUserAccessByAccessId(
        accessId
      );
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch user access by access ID." });
      logger.error(error.message);
    }
  }

  // Get user access by role ID
  async getByRoleId(req, res) {
    try {
      const { roleId } = req.params;
      const data = await UserAccessViewRepository.getUserAccessByRoleId(roleId);
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch user access by role ID." });
      logger.error(error.message);
    }
  }

  // Get user access by user name
  async getByUserName(req, res) {
    try {
      const { userName } = req.params;
      const data = await UserAccessViewRepository.getUserAccessByUserName(
        userName
      );
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch user access by user name." });
    }
  }
}

module.exports = new UserAccessViewController();

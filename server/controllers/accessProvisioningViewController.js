const accessProvisioningViewRepository = require("../repositories/accessProvisioningViewRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class AccessProvisioningViewController {
  async getAll(req, res) {
    try {
      const accessProvisioning = await accessProvisioningViewRepository.getAllAccessProvisioning();
      res.json(accessProvisioning);
    } catch (error) {
      res.status(500).json({ message: "Error fetching access provisioning records", error });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const accessProvisioning = await accessProvisioningViewRepository.getAccessProvisioningById(id);
      if (!accessProvisioning) {
        return res.status(404).json({ message: "Access provisioning not found" });
      }
      res.json(accessProvisioning);
    } catch (error) {
      res.status(500).json({ message: "Error fetching access provisioning record", error });
      logger.error(error.message);
    }
  }

  async getByRoleId(req, res) {
    try {
      const { roleId } = req.params;
      const accessProvisioning = await accessProvisioningViewRepository.getAccessProvisioningByRoleId(roleId);
      if (!accessProvisioning || accessProvisioning.length === 0) {
        return res.status(404).json({ message: "No access provisioning records found for the role" });
      }
      res.json(accessProvisioning);
    } catch (error) {
      res.status(500).json({ message: "Error fetching access provisioning by role", error });
      logger.error(error.message);
    }
  }

  async getByCondition(req, res) {
    try {
      const { access_name, access_type_id, access_role_id } = req.query;
  
      const accessProvisioning = await accessProvisioningViewRepository.getAccessProvisioningByCondition(
        access_name,
        access_type_id,
        access_role_id
      );
      if (!accessProvisioning || accessProvisioning.length === 0) {
        return res.status(404).json({ message: "No access provisioning records found for the condition" });
      }
      res.json(accessProvisioning);
    } catch (error) {
      res.status(500).json({ message: "Error fetching access provisioning by condition", error });
      logger.error(error.message);
    }
  }
}

module.exports = new AccessProvisioningViewController();

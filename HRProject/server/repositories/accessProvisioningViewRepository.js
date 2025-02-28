const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class AccessProvisioningViewRepository {
  async getAllAccessProvisioning() {
    try {
      const rows = await db.query("SELECT * FROM v_access_provisioning", {
        type: QueryTypes.SELECT, // Specify query type
      });
      return rows;
    } catch (error) {
      console.error("Error fetching all user employees:", error);
      throw error;
    }
  }

  async getAccessProvisioningById(id) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_access_provisioning WHERE access_id = :userId",
        {
          replacements: { id },
          type: QueryTypes.SELECT,
        }
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching user employee for user ID ${id}:`, error);
      throw error;
    }
  }

  async getAccessProvisioningByRoleId(roleId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_access_provisioning WHERE access_role_id = :roleId",
        {
          replacements: { roleId },
          type: QueryTypes.SELECT,
        }
      );
      return rows;
    } catch (error) {
      console.error(
        `Error fetching user employee for employee ID ${roleId}:`,
        error
      );
      throw error;
    }
  }
}

module.exports = new AccessProvisioningViewRepository();

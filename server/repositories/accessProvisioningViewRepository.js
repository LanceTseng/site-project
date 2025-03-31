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
        "SELECT * FROM v_access_provisioning WHERE access_id = :id",
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
        "SELECT * FROM v_access_provisioning WHERE user_role_id = :roleId",
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

  async getAccessProvisioningByCondition(
    access_name,
    access_type_id,
    access_role_id
  ) {
    try {
      const rows = await db.query(
        `SELECT * FROM v_access_provisioning 
         WHERE (:access_name IS NULL OR access_name LIKE :access_name) 
         AND (:access_type_id IS NULL OR access_type_id = :access_type_id) 
         AND (:access_role_id IS NULL OR user_role_id = :access_role_id)`,
        {
          replacements: {
            access_name: access_name ? `%${access_name}%` : null, // Ensures LIKE works
            access_type_id: access_type_id ? access_type_id : null,
            access_role_id: access_role_id ? access_role_id : null,
          },
          type: QueryTypes.SELECT,
        }
      );
      return rows;
    } catch (error) {
      console.error("Error fetching access provisioning records:", error);
      throw error;
    }
  }
}

module.exports = new AccessProvisioningViewRepository();

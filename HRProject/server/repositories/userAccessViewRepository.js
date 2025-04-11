const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class UserAccessViewRepository {
  async getAllUserAccess() {
    try {
      const rows = await db.query("SELECT * FROM v_user_access", {
        type: QueryTypes.SELECT, // Specify query type
      });
      return rows;
    } catch (error) {
      console.error("Error fetching all user employees:", error);
      throw error;
    }
  }

  async getUserAccessByUserId(userId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_user_access WHERE user_id = :userId",
        {
          replacements: { userId },
          type: QueryTypes.SELECT,
        }
      );
      return rows;
    } catch (error) {
      console.error(
        `Error fetching user employee for user ID ${userId}:`,
        error
      );
      throw error;
    }
  }

  async getUserAccessByAccessId(accessId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_user_access WHERE access_id = :userId",
        {
          replacements: { accessId },
          type: QueryTypes.SELECT,
        }
      );
      return rows;
    } catch (error) {
      console.error(
        `Error fetching user employee for user ID ${userId}:`,
        error
      );
      throw error;
    }
  }

  async getUserAccessByRoleId(roleId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_user_access WHERE access_role_id = :roleId",
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

  async getUserAccessByUserName(userName) {
    try {
        const rows = await db.query(
          "SELECT * FROM v_user_access WHERE user_name = :userName",
          {
            replacements: { userName },
            type: QueryTypes.SELECT,
          }
        );
        return rows;
      } catch (error) {
        console.error(
          `Error fetching user employee for employee ID ${userName}:`,
          error
        );
        throw error;
      }
  }
}

module.exports = new UserAccessViewRepository();

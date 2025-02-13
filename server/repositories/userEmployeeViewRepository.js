const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class UserEmployeeViewRepository {
  async getAllUserEmployee() {
    try {
      const rows = await db.query("SELECT * FROM v_user_employee", {
        type: QueryTypes.SELECT, // Specify query type
      });
      return rows;
    } catch (error) {
      console.error("Error fetching all user employees:", error);
      throw error;
    }
  }

  async getUserEmployeeByUserId(userId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_user_employee WHERE user_id = :userId",
        {
          replacements: { userId },
          type: QueryTypes.SELECT,
        }
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(
        `Error fetching user employee for user ID ${userId}:`,
        error
      );
      throw error;
    }
  }

  async getUserEmployeeByEmployeeId(empId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_user_employee WHERE employee_id = :empId",
        {
          replacements: { empId },
          type: QueryTypes.SELECT,
        }
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(
        `Error fetching user employee for employee ID ${empId}:`,
        error
      );
      throw error;
    }
  }

  async getUserEmployeeByUserName(userName) {
    try {
      let query = "SELECT * FROM v_user_employee";
      let replacements = {};

      if (userName) {
        query += " WHERE username LIKE :userName";
        replacements.userName = `%${userName}%`;
      }

      const rows = await db.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return rows;
    } catch (error) {
      console.error(`Error fetching user with name "${userName}":`, error);
      throw error;
    }
  }

  async getUserEmployeeByEmployeeStatus(status) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_user_employee WHERE status = :status",
        {
          replacements: { status },
          type: QueryTypes.SELECT,
        }
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error fetching user with status "${status}":`, error);
      throw error;
    }
  }
}

module.exports = new UserEmployeeViewRepository();

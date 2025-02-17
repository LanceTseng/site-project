const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class UserFormViewRepository {
  async getAllUserForm() {
    try {
      const rows = await db.query("SELECT * FROM v_user_form", {
        type: QueryTypes.SELECT, // Specify query type
      });
      return rows;
    } catch (error) {
      console.error("Error fetching all user employees:", error);
      throw error;
    }
  }

  async getUserFormByUserId(userId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_user_form WHERE user_id = :userId",
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
}

module.exports = new UserFormViewRepository();

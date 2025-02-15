const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class ChildTaskViewRespository {
  async getAllChildTask() {
    try {
      const rows = await db.query("SELECT * FROM v_child_tasks ", {
        type: QueryTypes.SELECT, // Specify query type
      });
      return rows;
    } catch (error) {
      console.error("Error fetching all user employees:", error);
      throw error;
    }
  }

  async getChildTaskById(id) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_child_tasks WHERE child_task_id   = :id",
        {
          replacements: { id },
          type: QueryTypes.SELECT,
        }
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error fetching user employee for user ID ${id}:`, error);
      throw error;
    }
  }

  async getChildTaskByParentId(id) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_child_tasks WHERE parent_task_id = :id",
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
}

module.exports = new ChildTaskViewRespository();

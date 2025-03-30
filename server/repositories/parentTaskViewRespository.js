const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class ParentTaskViewRepository {
  async geTrainingModuleViewByCondition(task_group_id) {
    try {
      let query = "SELECT * FROM v_parent_tasks WHERE 1=1";
      const replacements = {};

      if (task_group_id) {
        query += " AND task_group_id = :task_group_id";
        replacements.task_group_id = task_group_id;
      }

      const parentTasks = await db.query(query, {
        type: QueryTypes.SELECT,
        replacements: replacements,
      });
      return parentTasks;
    } catch (error) {
      console.error("Error fetching parent task by condition: ", error);
      throw error;
    }
  }
}

module.exports = new ParentTaskViewRepository();

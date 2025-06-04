const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class UserTaskViewRepository {
  /**
   * Get all user tasks
   */
  async getAllUserTasks() {
    try {
      return await db.query("SELECT * FROM v_user_task", {
        type: QueryTypes.SELECT,
      });
    } catch (error) {
      console.error("Error fetching all user tasks:", error);
      throw error;
    }
  }

  /**
   * Get user tasks by user ID
   */
  async getUserTaskByUserId(userId) {
    try {
      return await db.query("SELECT * FROM v_user_task WHERE user_id = ?", {
        type: QueryTypes.SELECT,
        replacements: [userId],
      });
    } catch (error) {
      console.error(`Error fetching user task for user ID ${userId}:`, error);
      throw error;
    }
  }

  async getUserTaskByHeadId(id) {
    try {
      return await db.query("SELECT * FROM v_user_task WHERE head_id = ?", {
        type: QueryTypes.SELECT,
        replacements: [id],
      });
    } catch (error) {
      console.error(`Error fetching user task for head ID ${id}:`, error);
      throw error;
    }
  }

  async getUserTaskByLineId(id) {
    try {
      return await db.query("SELECT * FROM v_user_task WHERE line_id = ?", {
        type: QueryTypes.SELECT,
        replacements: [id],
      });
    } catch (error) {
      console.error(`Error fetching user task for line ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all parent tasks
   */
  async getAllUserParentTask() {
    try {
      return await db.query("SELECT * FROM v_user_parent_task", {
        type: QueryTypes.SELECT,
      });
    } catch (error) {
      console.error("Error fetching all user parent tasks:", error);
      throw error;
    }
  }

  /**
   * Get parent tasks by user ID
   */
  async getUserParentTaskByUserId(userId) {
    try {
      return await db.query(
        "SELECT * FROM v_user_parent_task WHERE user_id = ?",
        {
          type: QueryTypes.SELECT,
          replacements: [userId],
        }
      );
    } catch (error) {
      console.error(
        `Error fetching parent tasks for user ID ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get all child tasks
   */
  async getAllUserChildTask() {
    try {
      return await db.query("SELECT * FROM v_user_child_task", {
        type: QueryTypes.SELECT,
      });
    } catch (error) {
      console.error("Error fetching all user child tasks:", error);
      throw error;
    }
  }

  /**
   * Get child tasks by parent task ID
   */
  async getUserChildTaskByTaskId(taskId) {
    try {
      return await db.query(
        "SELECT * FROM v_user_child_task WHERE user_parenttask_id = ?",
        {
          type: QueryTypes.SELECT,
          replacements: [taskId],
        }
      );
    } catch (error) {
      console.error(
        `Error fetching child tasks for parent task ID ${taskId}:`,
        error
      );
      throw error;
    }
  }

  async getUserParentTaskByCondition(taskName, userName, taskGroupId, userId) {
    try {
      let query = "SELECT * FROM v_user_parent_task WHERE 1=1";
      const replacements = {};

      if (taskName) {
        query += " AND pt_name  LIKE :taskName";
        replacements.taskName = `%${taskName}%`;
      }
      if (userName) {
        query += " AND user_name LIKE :userName";
        replacements.userName = `%${userName}%`;
      }

      if (taskGroupId) {
        query += " AND task_group_id = :taskGroupId";
        replacements.taskGroupId = taskGroupId;
      }

      if (userId) {
        query += " AND user_id = :userId";
        replacements.userId = userId;
      }

      const userParentTask = await db.query(query, {
        type: QueryTypes.SELECT,
        replacements: replacements,
      });
      return userParentTask;
    } catch (error) {
      console.error("Error fetching user parent tasks by condition: ", error);
      throw error;
    }
  }
}

// Export an instance of the class
module.exports = new UserTaskViewRepository();

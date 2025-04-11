const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class UserPaymentViewRepository {
  async getAllUserPayments() {
    try {
      const userPayments = await db.query("SELECT * FROM v_user_payment", {
        type: QueryTypes.SELECT,
      });
      return userPayments;
    } catch (error) {
      console.error("Error fetching user payments: ", error);
      throw error;
    }
  }

  async getUserPaymentsByCondition(name, department, status) {
    try {
      let query = "SELECT * FROM v_user_payment WHERE 1=1";
      const replacements = {};

      if (name) {
        query += " AND employee_first_name LIKE :name OR employee_last_name LIKE :name";
        replacements.name = `%${name}%`;
      }
      if (department) {
        query += " AND department_id = :department";
        replacements.department = department;
      }
      if (status) {
        query += " AND employee_status = :status";
        replacements.status = status;
      }

      const userPayments = await db.query(query, {
        type: QueryTypes.SELECT,
        replacements: replacements,
      });
      return userPayments;
    } catch (error) {
      console.error("Error fetching user payments by condition: ", error);
      throw error;
    }
  }
}

module.exports = new UserPaymentViewRepository();

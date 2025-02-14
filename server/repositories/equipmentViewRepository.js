const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class EquipmentViewRepository {
  async getAllEquipment() {
    try {
      const rows = await db.query(
        "SELECT * FROM v_equipment order by equipment_name asc",
        {
          type: QueryTypes.SELECT, // Specify query type
        }
      );
      return rows;
    } catch (error) {
      console.error("Error fetching all user employees:", error);
      throw error;
    }
  }

  async getEquipmentByUserId(userId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_equipment WHERE occupied_by = :userId",
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

  async getEquipmentByEqptId(eqptId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_equipment WHERE equipment_id = :eqptId",
        {
          replacements: { eqptId },
          type: QueryTypes.SELECT,
        }
      );
      return rows;
    } catch (error) {
      console.error(
        `Error fetching user employee for employee ID ${eqptId}:`,
        error
      );
      throw error;
    }
  }

  async getEquipmentByEqptName(eqptName) {
    try {
      let query = "SELECT * FROM v_equipment";
      let replacements = {};

      if (eqptName) {
        query += " WHERE equipment_name LIKE :eqptName";
        replacements.eqptName = `%${eqptName}%`;
      }

      const rows = await db.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return rows;
    } catch (error) {
      console.error(`Error fetching user with name "${eqptName}":`, error);
      throw error;
    }
  }

  async getEquipmentByEqptStatus(status) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_equipment WHERE occupied = :status",
        {
          replacements: { status },
          type: QueryTypes.SELECT,
        }
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching user with occupied "${status}":`, error);
      throw error;
    }
  }

  //---------------------------------occupied his view
  async getEqptOccupiedByUserId(userId) {
    try {
      const rows = await db.query(
        "SELECT * FROM  v_eqpt_occupied_his WHERE occupied_by = :userId",
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

  async getEqptOccupiedByEqptId(eqptId) {
    try {
      const rows = await db.query(
        "SELECT * FROM v_eqpt_occupied_his WHERE equipment_id = :eqptId order by occupied_date desc",
        {
          replacements: { eqptId },
          type: QueryTypes.SELECT,
        }
      );
      return rows;
    } catch (error) {
      console.error(
        `Error fetching user employee for employee ID ${eqptId}:`,
        error
      );
      throw error;
    }
  }
}

module.exports = new EquipmentViewRepository();

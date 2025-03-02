const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class TicketViewRepository {
  async getAllTickets() {
    try {
      return await db.query("SELECT * FROM v_tickets", {
        type: QueryTypes.SELECT,
      });
    } catch (error) {
      console.error("Error fetching all tickets:", error);
      throw error;
    }
  }
  async getTicketsByCondition(ticket_topic, department_id, status, user_id) {
    try {
      const rows = await db.query(
        `SELECT * FROM v_tickets
             WHERE (:ticket_topic IS NULL OR ticket_topic LIKE :ticket_topic) 
             AND (:ticket_department_id IS NULL OR ticket_department_id = :ticket_department_id) 
             AND (:ticket_status_id IS NULL OR ticket_status_id = :ticket_status_id)
             AND (:ticket_request_by_id IS NULL OR ticket_request_by_id = :ticket_request_by_id )`,
        {
          replacements: {
            ticket_topic: ticket_topic ? `%${ticket_topic}%` : null, // Ensures LIKE works
            ticket_department_id: department_id ? department_id : null,
            ticket_status_id: status ? status : null,
            ticket_request_by_id: user_id ? user_id : null,
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

module.exports = new TicketViewRepository();

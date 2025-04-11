const TicketHeadRepository = require("../repositories/ticketHeadRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class TicketHeadController {
  async getAll(req, res) {
    try {
      const tickets = await TicketHeadRepository.getAll();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket heads" });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const ticket = await TicketHeadRepository.getById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket head not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket head" });
      logger.error(error.message);
    }
  }

  async create(req, res) {
    try {
      const ticket = await TicketHeadRepository.create(req.body);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ticket head" });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const ticket = await TicketHeadRepository.update(req.params.id, req.body);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket head not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ticket head" });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await TicketHeadRepository.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Ticket head not found" });
      }
      res.json({ message: "Ticket head deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete ticket head" });
      logger.error(error.message);
    }
  }
}

module.exports = new TicketHeadController();

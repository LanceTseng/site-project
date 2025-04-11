const TicketDetailRepository = require("../repositories/ticketDetailRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class TicketDetailController {
  async getAll(req, res) {
    try {
      const details = await TicketDetailRepository.getAll();
      res.json(details);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket details" });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const detail = await TicketDetailRepository.getById(req.params.id);
      if (!detail) {
        return res.status(404).json({ error: "Ticket detail not found" });
      }
      res.json(detail);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket detail" });
      logger.error(error.message);
    }
  }

  async create(req, res) {
    try {
      const detail = await TicketDetailRepository.create(req.body);
      res.status(201).json(detail);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Failed to create ticket detail" });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const detail = await TicketDetailRepository.update(
        req.params.id,
        req.body
      );
      if (!detail) {
        return res.status(404).json({ error: "Ticket detail not found" });
      }
      res.json(detail);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ticket detail" });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await TicketDetailRepository.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Ticket detail not found" });
      }
      res.json({ message: "Ticket detail deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete ticket detail" });
      logger.error(error.message);
    }
  }
}

module.exports = new TicketDetailController();

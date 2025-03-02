

const TicketDetailRepository = require("../repositories/ticketDetailRepository");

class TicketDetailController {
  async getAll(req, res) {
    try {
      const details = await TicketDetailRepository.getAll();
      res.json(details);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket details" });
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
    }
  }

  async create(req, res) {
    try {
      const detail = await TicketDetailRepository.create(req.body);
      res.status(201).json(detail);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ticket detail" });
    }
  }

  async update(req, res) {
    try {
      const detail = await TicketDetailRepository.update(req.params.id, req.body);
      if (!detail) {
        return res.status(404).json({ error: "Ticket detail not found" });
      }
      res.json(detail);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ticket detail" });
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
    }
  }
}

module.exports = new TicketDetailController();

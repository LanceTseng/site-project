const TicketHeadRepository = require("../repositories/ticketHeadRepository");

class TicketHeadController {
  async getAll(req, res) {
    try {
      const tickets = await TicketHeadRepository.getAll();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket heads" });
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
    }
  }

  async create(req, res) {
    try {
      const ticket = await TicketHeadRepository.create(req.body);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ticket head" });
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
    }
  }
}

module.exports = new TicketHeadController();

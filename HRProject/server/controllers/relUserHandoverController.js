const RelUserHandoverRepo = require("../repositories/relUserHandoverRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger
const sanitizeHtml = require("sanitize-html");

class RelUserHandoverController {
  async create(req, res) {
    try {
      req.body.handover_note = sanitizeHtml(req.body.handover_note);
      const handover = await RelUserHandoverRepo.create(req.body);
      res.status(201).json(handover);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async getAll(req, res) {
    try {
      const handovers = await RelUserHandoverRepo.findAll();
      res.json(handovers);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const handover = await RelUserHandoverRepo.findById(req.params.id);
      if (!handover) return res.status(404).json({ message: "Not found" });
      res.json(handover);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async getByChildTaskId(req, res) {
    try {
      const handover = await RelUserHandoverRepo.findByChildTaskId(
        req.params.id
      ); //user child task id
      if (!handover) return res.status(404).json({ message: "Not found" });
      res.json(handover);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const updated = await RelUserHandoverRepo.update(req.params.id, req.body);
      if (!updated[0]) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const deleted = await RelUserHandoverRepo.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }
}

module.exports = new RelUserHandoverController();

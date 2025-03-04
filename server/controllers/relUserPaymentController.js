const RelUserPaymentRepository = require("../repositories/relUserPaymentRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class RelUserPaymentController {
  async createRelUserPayment(req, res) {
    try {
      const data = req.body;
      const relUserPayment =
        await RelUserPaymentRepository.createRelUserPayment(data);
      res.status(201).json(relUserPayment);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async getAllRelUserPayment(req, res) {
    try {
      const relUserPayment =
        await RelUserPaymentRepository.getAllRelUserPayment();
      if (relUserPayment) {
        res.status(200).json(relUserPayment);
      } else {
        res.status(404).json({ message: "RelUserPayment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }


  async getRelUserPaymentById(req, res) {
    try {
      const id = req.params.id;
      const relUserPayment =
        await RelUserPaymentRepository.getRelUserPaymentById(id);
      if (relUserPayment) {
        res.status(200).json(relUserPayment);
      } else {
        res.status(404).json({ message: "RelUserPayment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async updateRelUserPayment(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const relUserPayment =
        await RelUserPaymentRepository.updateRelUserPayment(id, data);
      if (relUserPayment[0] > 0) {
        res
          .status(200)
          .json({ message: "RelUserPayment updated successfully" });
      } else {
        res.status(404).json({ message: "RelUserPayment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }

  async deleteRelUserPayment(req, res) {
    try {
      const id = req.params.id;
      const result = await RelUserPaymentRepository.deleteRelUserPayment(id);
      if (result) {
        res
          .status(200)
          .json({ message: "RelUserPayment deleted successfully" });
      } else {
        res.status(404).json({ message: "RelUserPayment not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      logger.error(error.message);
    }
  }
}

module.exports = new RelUserPaymentController();

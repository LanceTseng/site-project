const eqptOccupiedHisRepo = require("../repositories/eqptOccupiedHisRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class EqptOccupiedHisController {
  async getAll(req, res) {
    try {
      const equipments = await eqptOccupiedHisRepo.getAll();
      res.json(equipments);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const equipment = await eqptOccupiedHisRepo.getById(req.params.id);
      if (!equipment)
        return res.status(404).json({ error: "Equipment not found" });
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getByUserId(req, res) {
    try {
      const equipment = await eqptOccupiedHisRepo.getByUserId(
        req.params.userid
      );
      if (!equipment)
        return res.status(404).json({ error: "Equipment not found" });
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getByEqptId(req, res) {
    try {
      const equipment = await eqptOccupiedHisRepo.getByEqptId(
        req.params.eqptid
      );
      if (!equipment)
        return res.status(404).json({ error: "Equipment not found" });
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async create(req, res) {
    try {
      const newEquipment = await eqptOccupiedHisRepo.create(req.body);
      res.status(201).json(newEquipment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const updatedEquipment = await eqptOccupiedHisRepo.update(
        req.params.id,
        req.body
      );
      if (!updatedEquipment)
        return res.status(404).json({ error: "Equipment not found" });
      res.json(updatedEquipment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await eqptOccupiedHisRepo.delete(req.params.id);
      if (!result)
        return res.status(404).json({ error: "Equipment not found" });
      res.json({ message: "Equipment deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }
}

module.exports = new EqptOccupiedHisController();

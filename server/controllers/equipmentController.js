const equipmentRepo = require("../repositories/equipmentRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class EquipmentController {
  async getAll(req, res) {
    try {
      const equipments = await equipmentRepo.getAll();
      res.json(equipments);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getById(req, res) {
    try {
      const equipment = await equipmentRepo.getById(req.params.id);
      if (!equipment)
        return res.status(404).json({ error: "Equipment not found" });
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async getByName(req, res) {
    try {
      const equipment = await equipmentRepo.getByName(req.params.name);
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
      const newEquipment = await equipmentRepo.create(req.body);
      res.status(201).json(newEquipment);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const updatedEquipment = await equipmentRepo.update(
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
      const result = await equipmentRepo.delete(req.params.id);
      if (!result)
        return res.status(404).json({ error: "Equipment not found" });
      res.json({ message: "Equipment deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error(error.message);
    }
  }
}

module.exports = new EquipmentController();

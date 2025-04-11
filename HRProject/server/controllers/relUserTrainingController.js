const RelUserTrainingRepository = require("../repositories/relUserTrainingRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class RelUserTrainingController {
  async create(req, res) {
    try {
      const data = req.body;
      const relUserTraining = await RelUserTrainingRepository.create(data);
      res.status(201).json(relUserTraining);
    } catch (error) {
      res.status(500).json({ message: error.message });
      logger.error(error.message);
    }
  }

  async findById(req, res) {
    try {
      const id = req.params.id;
      const relUserTraining = await RelUserTrainingRepository.findById(id);
      if (relUserTraining) {
        res.status(200).json(relUserTraining);
      } else {
        res.status(404).json({ message: "RelUserTraining not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
      logger.error(error.message);
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const relUserTraining = await RelUserTrainingRepository.update(id, data);
      if (relUserTraining[0] > 0) {
        res
          .status(200)
          .json({ message: "RelUserTraining updated successfully" });
      } else {
        res.status(404).json({ message: "RelUserTraining not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
      logger.error(error.message);
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const result = await RelUserTrainingRepository.delete(id);
      if (result) {
        res
          .status(200)
          .json({ message: "RelUserTraining deleted successfully" });
      } else {
        res.status(404).json({ message: "RelUserTraining not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
      logger.error(error.message);
    }
  }

  async findAll(req, res) {
    try {
      const relUserTrainings = await RelUserTrainingRepository.findAll();
      res.status(200).json(relUserTrainings);
    } catch (error) {
      res.status(500).json({ message: error.message });
      logger.error(error.message);
    }
  }
}

module.exports = new RelUserTrainingController();

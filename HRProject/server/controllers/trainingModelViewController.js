const TrainingModelViewRepository = require("../repositories/trainingModuleViewRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class TrainingModuleViewController {
  async getTrainingModuleViewByCondition(req, res) {
    const { name, department_id, status} = req.query;
    try {
      const training = await TrainingModelViewRepository.geTrainingModuleViewByCondition(
        name,
        department_id,
        status
      );
      res.status(200).json(training);
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ error: "Failed to fetch tickets by condition" });
    }
  }
}

module.exports = new TrainingModuleViewController();

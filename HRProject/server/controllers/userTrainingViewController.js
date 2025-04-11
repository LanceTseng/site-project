const UserTrainingViewRepository = require('../repositories/userTrainingViewRepository');
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class UserTrainingViewController {
    async getTrainingModuleViewByCondition(req, res) {
        try {
            const { training_name, user_name, department, status, user_childtask_id } = req.query;
            const userTraining = await UserTrainingViewRepository.geTrainingModuleViewByCondition(
                training_name,
                user_name,
                department,
                status,
                user_childtask_id
            );
            res.status(200).json(userTraining);
        } catch (error) {
            console.error("Error fetching training module view by condition: ", error);
            res.status(500).json({ error: "An error occurred while fetching the training module view." });
            logger.error(error.message);
        }
    }
}

module.exports = new UserTrainingViewController();
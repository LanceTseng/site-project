const UserPaymentViewRepository = require("../repositories/userPaymentViewRepository");
const { logger } = require("../middlewares/loggerMiddleware"); // Import logger

class UserPaymentViewController {
  async getAllUserPayments(req, res) {
    try {
      const userPayments = await UserPaymentViewRepository.getAllUserPayments();
      res.status(200).json(userPayments);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching user payments." });
      logger.error(error.message);
    }
  }

  async getUserPaymentsByCondition(req, res) {
    try {
      const { name, department, status } = req.query;
      const userPayments =
        await UserPaymentViewRepository.getUserPaymentsByCondition(
          name,
          department,
          status
        );
      res.status(200).json(userPayments);
    } catch (error) {
      res.status(500).json({
        error: "An error occurred while fetching user payments by condition.",
      });
      logger.error(error.message);
    }
  }
}

module.exports = new UserPaymentViewController();

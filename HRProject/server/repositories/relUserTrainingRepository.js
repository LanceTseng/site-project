const RelUserTraining = require("../models/RelUserTraining");

class RelUserTrainingRepository {
  async create(data) {
    try {
      const relUserTraining = await RelUserTraining.create(data);
      return relUserTraining;
    } catch (error) {
      throw new Error("Error creating RelUserTraining: " + error.message);
    }
  }

  async findById(id) {
    try {
      const relUserTraining = await RelUserTraining.findByPk(id);
      return relUserTraining;
    } catch (error) {
      throw new Error("Error finding RelUserTraining by ID: " + error.message);
    }
  }

  async update(id, data) {
    try {
      const relUserTraining = await RelUserTraining.update(data, {
        where: { id: id },
      });
      return relUserTraining;
    } catch (error) {
      throw new Error("Error updating RelUserTraining: " + error.message);
    }
  }

  async delete(id) {
    try {
      const result = await RelUserTraining.destroy({
        where: { id: id },
      });
      return result;
    } catch (error) {
      throw new Error("Error deleting RelUserTraining: " + error.message);
    }
  }

  async findAll() {
    try {
      const relUserTrainings = await RelUserTraining.findAll();
      return relUserTrainings;
    } catch (error) {
      throw new Error("Error finding all RelUserTrainings: " + error.message);
    }
  }
}

module.exports = new RelUserTrainingRepository();

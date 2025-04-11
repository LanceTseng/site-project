const TrainingModule = require('../models/TrainingModule');

class TrainingModuleRepository {
  async getAll() {
    return await TrainingModule.findAll();
  }

  async getById(id) {
    return await TrainingModule.findByPk(id);
  }

  async getByDepartmentId(id) {
    return await TrainingModule.findAll({ where: { training_department_id: id } });
  }

  async getByName(name) {
    return await TrainingModule.findOne({ where: { training_module_name: name } });
  }

  async create(moduleData) {
    return await TrainingModule.create(moduleData);
  }

  async update(id, moduleData) {
    await TrainingModule.update(moduleData, { where: { training_module_id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await TrainingModule.destroy({ where: { training_module_id: id } });
  }
}

module.exports = new TrainingModuleRepository();

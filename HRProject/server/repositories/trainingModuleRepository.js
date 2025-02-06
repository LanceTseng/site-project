const TrainingModule = require('../models/TrainingModule');

class TrainingModuleRepository {
  async getAll() {
    return await TrainingModule.findAll();
  }

  async getById(id) {
    return await TrainingModule.findByPk(id);
  }

  async getByName(name) {
    return await TrainingModule.findOne({ where: { trainning_module_name: name } });
  }

  async create(moduleData) {
    return await TrainingModule.create(moduleData);
  }

  async update(id, moduleData) {
    await TrainingModule.update(moduleData, { where: { trainning_module_id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await TrainingModule.destroy({ where: { trainning_module_id: id } });
  }
}

module.exports = new TrainingModuleRepository();

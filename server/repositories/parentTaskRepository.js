const ParentTask = require('../models/ParentTask');

class ParentTaskRepository {
  async getAll() {
    return await ParentTask.findAll();
  }

  async getById(id) {
    return await ParentTask.findByPk(id);
  }

  async create(taskData) {
    return await ParentTask.create(taskData);
  }

  async update(id, taskData) {
    await ParentTask.update(taskData, { where: { task_id: id } });
    return this.getById(id);  // Return the updated record
  }

  async delete(id) {
    return await ParentTask.destroy({ where: { task_id: id } });
  }
}

module.exports = new ParentTaskRepository();

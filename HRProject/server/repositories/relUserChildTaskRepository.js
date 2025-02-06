const RelUserChildTask = require('../models/RelUserChildTask');

class RelUserChildTaskRepository {
  async getAll() {
    return await RelUserChildTask.findAll();
  }

  async getById(id) {
    return await RelUserChildTask.findByPk(id);
  }

  async create(taskData) {
    return await RelUserChildTask.create(taskData);
  }

  async update(id, taskData) {
    await RelUserChildTask.update(taskData, { where: { id } });
    return this.getById(id);
  }

  async delete(id) {
    return await RelUserChildTask.destroy({ where: { id } });
  }
}

module.exports = new RelUserChildTaskRepository();

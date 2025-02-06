const ChildTask = require('../models/ChildTask');

class ChildTaskRepository {
  // Get all child tasks
  async getAll() {
    return await ChildTask.findAll();
  }

  // Get child task by ID
  async getById(id) {
    return await ChildTask.findByPk(id);
  }

  // Create new child task
  async create(taskData) {
    return await ChildTask.create(taskData);
  }

  // Update child task by ID
  async update(id, taskData) {
    await ChildTask.update(taskData, { where: { child_task_id: id } });
    return this.getById(id);  // Return updated record
  }

  // Delete child task by ID
  async delete(id) {
    return await ChildTask.destroy({ where: { child_task_id: id } });
  }
}

module.exports = new ChildTaskRepository();

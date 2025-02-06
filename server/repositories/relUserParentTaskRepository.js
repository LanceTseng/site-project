const RelUserParentTask = require('../models/RelUserParentTask');

class RelUserParentTaskRepository {
  // Get all user-parent task relationships
  async getAll() {
    return await RelUserParentTask.findAll();
  }

  // Get relationship by ID
  async getById(id) {
    return await RelUserParentTask.findByPk(id);
  }

  // Create a new user-parent task relationship
  async create(relUserParentTaskData) {
    return await RelUserParentTask.create(relUserParentTaskData);
  }

  // Update a user-parent task relationship by ID
  async update(id, relUserParentTaskData) {
    await RelUserParentTask.update(relUserParentTaskData, { where: { id } });
    return this.getById(id);  // Return the updated record
  }

  // Delete a user-parent task relationship by ID
  async delete(id) {
    return await RelUserParentTask.destroy({ where: { id } });
  }
}

module.exports = new RelUserParentTaskRepository();

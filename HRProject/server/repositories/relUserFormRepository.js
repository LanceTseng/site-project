const RelUserForm = require("../models/RelUserForm");

class RelUserFormRepository {
  async getAll() {
    return await RelUserForm.findAll();
  }

  async getById(id) {
    return await RelUserForm.findByPk(id);
  }

  async getByUserId(id) {
    return await RelUserForm.findAll({ where: { user_id: id } });
  }

  async create(taskData) {
    return await RelUserForm.create(taskData);
  }

  async update(id, taskData) {
    await RelUserForm.update(taskData, { where: { id } });
    return this.getById(id);
  }

  async delete(id) {
    return await RelUserForm.destroy({ where: { id } });
  }
}

module.exports = new RelUserFormRepository();

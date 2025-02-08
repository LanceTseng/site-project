const User = require("../models/User");

class UserRepository {
  async getAll() {
    return await User.findAll();
  }

  async getById(id) {
    return await User.findByPk(id);
  }

  async getByName(name) {
    console.log(name);
    return await User.findOne({ where: { userName: name } });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, userData) {
    await User.update(userData, { where: { user_id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await User.destroy({ where: { user_id: id } });
  }
}

module.exports = new UserRepository();

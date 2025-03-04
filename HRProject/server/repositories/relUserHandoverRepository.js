const RelUserHandover = require("../models/RelUserHandover");

class RelUserHandoverRepo {
  async create(data) {
    return await RelUserHandover.create(data);
  }

  async findAll() {
    return await RelUserHandover.findAll();
  }

  async findById(id) {
    return await RelUserHandover.findByPk(id);
  }

  async findByChildTaskId(childTaskId) {
    return await RelUserHandover.findAll({
      where: { user_childtask_id: childTaskId },
    });
  }

  async update(id, data) {
    return await RelUserHandover.update(data, { where: { id } });
  }

  async delete(id) {
    return await RelUserHandover.destroy({ where: { id } });
  }
}

module.exports = new RelUserHandoverRepo();

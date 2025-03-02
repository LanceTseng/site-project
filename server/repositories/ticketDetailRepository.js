const TicketDetail = require('../models/TicketDetail');

class TicketDetailRepository {
  async getAll() {
    return await TicketDetail.findAll();
  }

  async getById(id) {
    return await TicketDetail.findByPk(id);
  }

  async create(moduleData) {
    return await TicketDetail.create(moduleData);
  }

  async update(id, moduleData) {
    await TicketDetail.update(moduleData, { where: { id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await TicketDetail.destroy({ where: { id: id } });
  }
}

module.exports = new TicketDetailRepository();
const TicketHead = require('../models/TicketHead');

class TicketHeadRepository {
  async getAll() {
    return await TicketHead.findAll();
  }

  async getById(id) {
    return await TicketHead.findByPk(id);
  }

  async create(moduleData) {
    return await TicketHead.create(moduleData);
  }

  async update(id, moduleData) {
    await TicketHead.update(moduleData, { where: { id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await TicketHead.destroy({ where: { id: id } });
  }
}

module.exports = new TicketHeadRepository();
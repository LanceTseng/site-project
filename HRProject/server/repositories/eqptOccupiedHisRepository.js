const EqptOccupiedHis = require("../models/EqptOccupiedHis");

class EqptOccupiedHisRepository {
  async getAll() {
    return await EqptOccupiedHis.findAll();
  }

  async getById(id) {
    return await EqptOccupiedHis.findByPk(id);
  }

  async getByUserId(userId) {
    return await EqptOccupiedHis.findAll({
      where: { occupied_by: userId },
    });
  }

  async getByEqptId(eqpt_id) {
    return await EqptOccupiedHis.findAll({
      where: { equipment_id: eqpt_id },
    });
  }

  async create(data) {
    return await EqptOccupiedHis.create(data);
  }

  async update(id, data) {
    await EqptOccupiedHis.update(data, { where: { id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await EqptOccupiedHis.destroy({ where: { id: id } });
  }
}

module.exports = new EqptOccupiedHisRepository();

const Equipment = require('../models/Equipment');

class EquipmentRepository {
  async getAll() {
    return await Equipment.findAll();
  }

  async getById(id) {
    return await Equipment.findByPk(id);
  }

  async getByName(name) {
    return await Equipment.findOne({
      where: { equipment_name: name }
    });
  }

  async create(data) {
    return await Equipment.create(data);
  }

  async update(id, data) {
    await Equipment.update(data, { where: { equipment_id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await Equipment.destroy({ where: { equipment_id: id } });
  }
}

module.exports = new EquipmentRepository();

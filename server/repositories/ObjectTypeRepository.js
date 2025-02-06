const ObjectType = require('../models/ObjectType');

class ObjectTypeRepository {
  async getAll() {
    return await ObjectType.findAll();
  }

  async getById(id) {
    return await ObjectType.findByPk(id);
  }

  async getByName(name) {
    return await ObjectType.findOne({ where: { object_type_name: name } });
  }

  async create(data) {
    return await ObjectType.create(data);
  }

  async update(id, data) {
    await ObjectType.update(data, { where: { object_id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await ObjectType.destroy({ where: { object_id: id } });
  }
}

module.exports = new ObjectTypeRepository();

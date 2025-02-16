const ObjectType = require("../models/ObjectType");

class ObjectTypeRepository {
  async getAll() {
    return await ObjectType.findAll();
  }

  async getById(id) {
    return await ObjectType.findByPk(id);
  }

  async getByName(name) {
    return await ObjectType.findAll({
      where: { object_type_name: name },
      order: [
        ["object_type_name", "ASC"],
        ["object_sequence", "ASC"],
        ["object_type_item_value", "ASC"],
      ],
    });
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

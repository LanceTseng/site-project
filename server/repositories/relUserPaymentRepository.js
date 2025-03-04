const RelUserPayment = require("../models/RelUserPayment");

class RelUserPaymentRepository {
  async createRelUserPayment(data) {
    try {
      return await RelUserPayment.create(data);
    } catch (error) {
      throw error;
    }
  }

  async getRelUserPaymentById(id) {
    try {
      return await RelUserPayment.findByPk(id);
    } catch (error) {
      throw error;
    }
  }
  async getAllRelUserPayment() {
    try {
      return await RelUserPayment.findAll();
    } catch (error) {
      throw error;
    }
  }

  async updateRelUserPayment(id, data) {
    try {
      return await RelUserPayment.update(data, {
        where: { id: id },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteRelUserPayment(id) {
    try {
      return await RelUserPayment.destroy({
        where: { id: id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RelUserPaymentRepository();

const equipmentViewRepo = require("../repositories/equipmentViewRepository");

class EquipmentViewController {
  async getAllEpuipmentView(req, res) {
    try {
      const equipment = await equipmentViewRepo.getAllEquipment();
      res.status(200).json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
    }
  }

  async getEpuipmentViewByUserId(req, res) {
    try {
      const equipment = await equipmentViewRepo.getEquipmentByUserId(
        req.params.userid
      );
      if (!equipment) {
        return res.status(404).json({ message: "Data not found" });
      }
      res.status(200).json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
    }
  }

  async getEpuipmentViewByEqptId(req, res) {
    try {
      const equipment = await equipmentViewRepo.getEquipmentByEqptId(
        req.params.eqptid
      );
      if (!equipment) {
        return res.status(404).json({ message: "UserTask not found" });
      }
      res.status(200).json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
    }
  }

  async getEpuipmentViewByEqptName(req, res) {
    try {
      const equipment = await equipmentViewRepo.getEquipmentByEqptName(
        req.params.eqptname
      );
      if (!equipment) {
        return res.status(404).json({ message: "UserTask not found" });
      }
      res.status(200).json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
    }
  }

  async getEpuipmentViewByStatus(req, res) {
    try {
      const equipment = await equipmentViewRepo.getEpuipmentViewByStatus(
        req.params.status
      );
      if (!equipment) {
        return res.status(404).json({ message: "UserTask not found" });
      }
      res.status(200).json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
    }
  }

  //-----------------------------------------Eqpt Occupied View
  async getEqptOccupiedViewByUserId(req, res) {
    try {
      const equipment = await equipmentViewRepo.getEqptOccupiedByUserId(
        req.params.userid
      );
      if (!equipment) {
        return res.status(404).json({ message: "Data not found" });
      }
      res.status(200).json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userTasks" });
    }
  }

  async getEqptOccupiedViewByEqptId(req, res) {
    try {
      const userEmp =
        await equipmentViewRepo.getEqptOccupiedByEqptId(
          req.params.eqptid
        );
      if (!userEmp) {
        return res.status(404).json({ message: "UserEmployee not found" });
      }
      console.log(userEmp);
      res.status(200).json(userEmp);
    } catch (error) {
      res.status(500).json({ error: "Error fetching userEmp" });
    }
  }

}
module.exports = new EquipmentViewController();

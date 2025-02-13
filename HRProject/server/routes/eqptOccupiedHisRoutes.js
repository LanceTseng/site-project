const express = require("express");
const EqptOccupiedHisController = require("../controllers/eqptOccupiedHisController");

const router = express.Router();

router.get("/eqpt-occupied-his", EqptOccupiedHisController.getAll);
router.get("/eqpt-occupied-his/:id", EqptOccupiedHisController.getById);
router.get(
  "/eqpt-occupied-his/userid/:userid",
  EqptOccupiedHisController.getByUserId
); // Get by name
router.get(
    "/eqpt-occupied-his/eqptid/:eqptid",
    EqptOccupiedHisController.getByEqptId
  ); // Get by name
router.post("/eqpt-occupied-his", EqptOccupiedHisController.create);
router.put("/eqpt-occupied-his/:id", EqptOccupiedHisController.update);
router.delete("/eqpt-occupied-his/:id", EqptOccupiedHisController.delete);

module.exports = router;

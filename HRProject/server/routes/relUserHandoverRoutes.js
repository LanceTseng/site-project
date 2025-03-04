const express = require("express");
const router = express.Router();
const RelUserHandoverController = require("../controllers/relUserHandoverController");

router.post("/rel-user-handover", RelUserHandoverController.create);
router.get("/rel-user-handover", RelUserHandoverController.getAll);
router.get("/rel-user-handover/:id", RelUserHandoverController.getById);
router.get(
  "/rel-user-handover/childtaskid/:id",
  RelUserHandoverController.getByChildTaskId
);
router.get(
    "/rel-user-handover/review/:id",
    RelUserHandoverController.getByChildTaskId
  );
router.put("/rel-user-handover/:id", RelUserHandoverController.update);
router.delete("/rel-user-handover/:id", RelUserHandoverController.delete);

module.exports = router;

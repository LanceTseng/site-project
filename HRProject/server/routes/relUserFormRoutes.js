const express = require("express");
const UserFormController = require("../controllers/relUserFormController");

const router = express.Router();

router.get("/rel-user-form", UserFormController.getAll);
router.get("/rel-user-form/:id", UserFormController.getById);
router.get("/rel-user-form/userid/:id", UserFormController.getByUserId);
router.post("/rel-user-form", UserFormController.create);
router.put("/rel-user-form/:id", UserFormController.update);
router.delete("/rel-user-form/:id", UserFormController.delete);

module.exports = router;

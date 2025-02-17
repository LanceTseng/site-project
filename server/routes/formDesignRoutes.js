const express = require("express");
const formDesignController = require("../controllers/formDesignController");

const router = express.Router();

router.get("/form-design", formDesignController.getAll);
router.get("/form-design/:id", formDesignController.getById);
router.get("/form-design/formid/:id", formDesignController.getByFormId);
router.post("/form-design", formDesignController.create);
router.put("/form-design/:id", formDesignController.update);
router.delete("/form-design/:id", formDesignController.delete);

module.exports = router;

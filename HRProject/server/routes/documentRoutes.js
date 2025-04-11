const express = require("express");
const DocumentController = require("../controllers/documentController");
const UploadFile = require("../middlewares/multerConfig");

const router = express.Router();

router.get("/documents", DocumentController.getAll);
router.get("/documents/:id", DocumentController.getById);
router.get("/documents/name/:name", DocumentController.getByName); // Get by name
router.post("/documents", DocumentController.create);
router.put("/documents/:id", DocumentController.update);
router.delete("/documents/:id", DocumentController.delete);

module.exports = router;

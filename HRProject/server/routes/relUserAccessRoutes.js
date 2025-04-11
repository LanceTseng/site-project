const express = require("express");
const UserAccessController = require("../controllers/relUserAccessController");

const router = express.Router();

// Get all user accesses
router.get("/rel-user-access", UserAccessController.getAll);

router.get("/rel-user-access/userid/:userid", UserAccessController.getByUserId);

// Get user access by composite key (userId & accessId)
router.get("/rel-user-access/userid/:userId/accessid/:accessId", UserAccessController.getById);

// Create a new user access
router.post("/rel-user-access", UserAccessController.create);

// Update an existing user access
router.put("/rel-user-access/:userId/:accessId", UserAccessController.update);

// Delete a user access
router.delete("/rel-user-access/:userId/:accessId", UserAccessController.delete);

module.exports = router;

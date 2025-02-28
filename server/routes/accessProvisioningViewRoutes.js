const express = require("express");
const router = express.Router();
const AccessProvisioningViewController = require("../controllers/accessProvisioningViewController");

// Get all access provisioning records
router.get("/access-provisioning-view", AccessProvisioningViewController.getAll);

// Get access provisioning by ID
router.get("/access-provisioning-view/:id", AccessProvisioningViewController.getById);

// Get access provisioning by Role ID
router.get("/access-provisioning-view/role/:roleId", AccessProvisioningViewController.getByRoleId);

module.exports = router;

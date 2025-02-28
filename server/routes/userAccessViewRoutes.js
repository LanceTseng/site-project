const express = require("express");
const router = express.Router();
const UserAccessViewController = require("../controllers/userAccessViewController");

// Define routes for User Access View
router.get("/user-access-view", UserAccessViewController.getAll);
router.get("/user-access-view/user/:userId", UserAccessViewController.getByUserId);
router.get("/user-access-view/access/:accessId", UserAccessViewController.getByAccessId);
router.get("/user-access-view/role/:roleId", UserAccessViewController.getByRoleId);
router.get("/user-access-view/username/:userName", UserAccessViewController.getByUserName);

module.exports = router;

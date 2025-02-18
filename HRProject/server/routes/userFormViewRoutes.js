const express = require("express");
const UserFormViewController = require("../controllers/userFormViewController");

const router = express.Router();

router.get("/user-form-view", UserFormViewController.getAllUserFormView);
router.get(
  "/user-form-view/userid/:userid",
  UserFormViewController.getUserFormViewByUserId
);
router.get(
  "/user-form-view/lineid/:lineid",
  UserFormViewController.getUserFormViewByLineId
);


module.exports = router;

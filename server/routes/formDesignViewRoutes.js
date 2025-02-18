const express = require("express");
const FormDesignViewController = require("../controllers/formDesignViewController");

const router = express.Router();

router.get("/form-design-view", FormDesignViewController.getAllFormDesignView);
router.get(
  "/form-design-view/formid/:formdid",
  FormDesignViewController.getFormDesignViewByFormId
);

module.exports = router;

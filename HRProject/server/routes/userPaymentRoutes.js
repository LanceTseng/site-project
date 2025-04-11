const express = require("express");
const RelUserPaymentController = require("../controllers/relUserPaymentController");
const UserPaymentViewController = require("../controllers/userPaymentViewController");
const router = express.Router();

router.post("/rel-user-payment", RelUserPaymentController.createRelUserPayment);
router.get(
  "/rel-user-payment",
  RelUserPaymentController.getAllRelUserPayment
);
router.get(
  "/rel-user-payment/:id",
  RelUserPaymentController.getRelUserPaymentById
);
router.put(
  "/rel-user-payment/:id",
  RelUserPaymentController.updateRelUserPayment
);
router.delete(
  "/rel-user-payment/:id",
  RelUserPaymentController.deleteRelUserPayment
);

//view
router.get("/user-payment-view", UserPaymentViewController.getAllUserPayments);
router.get(
  "/user-payment-view/condition",
  UserPaymentViewController.getUserPaymentsByCondition
);

module.exports = router;

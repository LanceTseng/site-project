const express = require("express");
const TicketDetailController = require("../controllers/ticketDetailController");
const TicketHeadController = require("../controllers/ticketHeadController");
const TicketViewController = require("../controllers/ticketViewController");

const router = express.Router();

//head
router.get("/ticket-head", TicketHeadController.getAll);
router.get("/ticket-head/:id", TicketHeadController.getById);
router.post("/ticket-head", TicketHeadController.create);
router.put("/ticket-head/:id", TicketHeadController.update);
router.delete("/ticket-head/:id", TicketHeadController.delete);

//detail
router.get("/ticket-detail", TicketDetailController.getAll);
router.get("/ticket-detail/:id", TicketDetailController.getById);
router.post("/ticket-detail", TicketDetailController.create);
router.put("/ticket-detail/:id", TicketDetailController.update);
router.delete("/ticket-detail/:id", TicketDetailController.delete);

//view
router.get("/ticket-view", TicketViewController.getAllTickets);
router.get("/ticket-view/condition", TicketViewController.getTicketsByCondition);
router.get("/ticket-head-view", TicketViewController.getAllTicketHeadView);
router.get("/ticket-head-view/condition", TicketViewController.getTicketHeadViewByCondition);


module.exports = router;

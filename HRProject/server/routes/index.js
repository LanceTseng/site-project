const express = require('express');
const router = express.Router();

// Route for home page
router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Route for Login Settings
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/maintenance", (req, res) => {
  res.render("maintenance/mgmt-index");
});

// Route for Task Settings
router.get("/mgmt-task", (req, res) => {
  res.render("maintenance/mgmt-task");
});

// Route for Subtask Settings, with taskId as a parameter
router.get("/mgmt-subtask/:taskId", (req, res) => {
  // Get the taskId from the route parameter
  const taskId = req.params.taskId;
  // Pass taskId (and task details, if needed) to the view
  res.render("maintenance/mgmt-subtask", { taskId });
});

// Route for Task Settings
router.get("/mgmt-equiptment", (req, res) => {
  res.render("maintenance/mgmt-equiptment");
});


// Route for onboarding
router.get("/onboarding", (req, res) => {
  res.render("onboard/onboarding", { title: "Onboarding" });
});

router.get("/offboarding", (req, res) => {
  res.render("offboard/offboarding", { title: "Offboarding" });
});

//route for report
router.get("/report", (req, res) => {
  res.render("report/report-index");
});

router.get("/report-user-task", (req, res) => {
  res.render("report/report-user-task");
});

router.get("/report-user-employee", (req, res) => {
  res.render("report/report-user-employee");
});

router.get("/report-goal", (req, res) => {
  res.render("pages/goal");
});

 
module.exports = router;

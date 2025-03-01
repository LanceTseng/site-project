const express = require("express");
const router = express.Router();

// Route for home page
router.get("/", (req, res) => {
  res.render("login", { title: "Login" });
});

//hr dashboard
router.get("/dashboard-hr", (req, res) => {
  res.render("dashboard-hr", { title: "HR Dashboard" });
});

//employee dashboard
router.get("/dashboard-employee", (req, res) => {
  res.render("dashboard-employee",{ title: "Employee Dashboard" });
});

router.get("/dashboard-it", (req, res) => {
  res.render("dashboard-it",{ title: "IT Dashboard" });
});



// Route for Login Settings
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/logout", (req, res) => {
  res.render("logout");
});


router.get("/unauth", (req, res) => {
  res.render("pages/unauthorized");
});

// Route for onboarding
router.get("/onboarding", (req, res) => {
  res.render("onboard/onboarding", { title: "Onboarding" });
});

router.get("/offboarding", (req, res) => {
  res.render("offboard/offboarding", { title: "Offboarding" });
});

// Route for Form Settings
router.get("/form/:formid?/lineid/:lineid?", (req, res) => {
  const { formid, lineid } = req.params;

  res.render("pages/form", { formid, lineid });
});
router.get("/form-review/:lineid?", (req, res) => {
  const { lineid } = req.params;
  res.render("pages/form-review", { lineid });
});

//--

//------------------------------------------------------
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

router.get("/mgmt-user-employee", (req, res) => {
  res.render("maintenance/mgmt-user-employee");
});

router.get("/mgmt-document", (req, res) => {
  res.render("maintenance/mgmt-document");
});

// Route for Task Settings
router.get("/mgmt-access", (req, res) => {
  res.render("maintenance/mgmt-access-provisioning");
});

// Route for Task Settings
router.get("/mgmt-user-access", (req, res) => {
  res.render("maintenance/mgmt-user-access");
});


//------------------------------------------------------
//route for report
router.get("/report", (req, res) => {
  res.render("report/report-index");
});

router.get("/report-user-task", (req, res) => {
  res.render("report/report-user-task");
});

router.get("/report-goal", (req, res) => {
  res.render("pages/goal");
});

//upload test
router.get("/upload", (req, res) => {
  res.render("upload");
});

module.exports = router;

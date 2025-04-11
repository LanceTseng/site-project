const express = require("express");
const ParentTaskController = require("../controllers/parentTaskController");

const router = express.Router();

router.get("/parent-tasks", ParentTaskController.getAll);
router.get("/parent-tasks/:id", ParentTaskController.getById);
router.get("/parent-tasks/group-id/:id", ParentTaskController.getByGroupId);
router.post("/parent-tasks", ParentTaskController.create);
router.put("/parent-tasks/:id", ParentTaskController.update);
router.delete("/parent-tasks/:id", ParentTaskController.delete);

router.get(
  "/parent-tasks-view/condition?",
  ParentTaskController.getParentTasksViewByCondition
);

module.exports = router;

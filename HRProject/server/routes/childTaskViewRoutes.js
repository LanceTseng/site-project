const express = require('express');
const ChildTaskViewController = require('../controllers/childTaskViewController');

const router = express.Router();

router.get('/child-task-view', ChildTaskViewController.getAllChildTask);
router.get('/child-task-view/:id', ChildTaskViewController.getChildTaskById);
router.get('/child-task-view/parent/:id', ChildTaskViewController.getChildTaskByParentId);
 

module.exports = router;

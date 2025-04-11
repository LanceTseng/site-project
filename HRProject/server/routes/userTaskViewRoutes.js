const express = require('express');
const UserTaskViewController = require('../controllers/userTaskViewController');

const router = express.Router();

router.get('/user-task-view', UserTaskViewController.getAllUserTaskView);
router.get('/user-task-view/userid/:userid', UserTaskViewController.getUserTaskViewByUserId);
router.get('/user-task-view/head/:id', UserTaskViewController.getUserTaskViewByHeadId);
router.get('/user-task-view/line/:id', UserTaskViewController.getUserTaskViewByLineId);

router.get('/user-parent-task-view/condition?', UserTaskViewController.getUserTaskViewByCondition);
router.get('/user-parent-task-view', UserTaskViewController.getAllUserParentTaskView);
router.get('/user-parent-task-view/:id', UserTaskViewController.getUserParendTaskViewByUserId);

router.get('/user-child-task-view', UserTaskViewController.getAllUserChildTaskView);
router.get('/user-child-task-view/:id', UserTaskViewController.getUserChildTaskViewByTaskId);
module.exports = router;

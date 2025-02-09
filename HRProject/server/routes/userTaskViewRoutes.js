const express = require('express');
const UserTaskViewController = require('../controllers/userTaskViewController');

const router = express.Router();

router.get('/usertaskview', UserTaskViewController.getAllUserTaskView);
router.get('/usertaskview/:id', UserTaskViewController.getUserTaskViewById); 

module.exports = router;

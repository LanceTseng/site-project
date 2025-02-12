const express = require('express');
const UserEmployeeViewController = require('../controllers/userEmployeeViewController');

const router = express.Router();

router.get('/user-emp-view', UserEmployeeViewController.getAllUserEmployeeView);
router.get('/user-emp-view/userid/:userid', UserEmployeeViewController.getUserEmployeeViewByUserId);
router.get('/user-emp-view/eid/:eid', UserEmployeeViewController.getUserEmployeeViewByEmployeeId);
router.get('/user-emp-view/username/:username', UserEmployeeViewController.getUserEmployeeViewByUsername);
router.get('/user-emp-view/status/:status', UserEmployeeViewController.getUserEmployeeViewByEmployeeStatus);
 
module.exports = router;

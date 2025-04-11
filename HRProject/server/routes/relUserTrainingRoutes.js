const express = require('express');
const RelUserTrainingController = require('../controllers/relUserTrainingController');
const UserTrainingViewController = require('../controllers/userTrainingViewController');

const router = express.Router();

router.post('/rel-user-training', RelUserTrainingController.create);
router.get('/rel-user-training/:id', RelUserTrainingController.findById);
router.put('/rel-user-training/:id', RelUserTrainingController.update);
router.delete('/rel-user-training/:id', RelUserTrainingController.delete);
router.get('/rel-user-training', RelUserTrainingController.findAll);

//view
router.get('/user-training-view/condition', UserTrainingViewController.getTrainingModuleViewByCondition);

module.exports = router;
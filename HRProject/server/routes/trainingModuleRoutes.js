const express = require('express');
const TrainingModuleController = require('../controllers/trainingModuleController');
const TrainingModuleViewController = require('../controllers/trainingModelViewController');
const router = express.Router();

router.get('/training-modules', TrainingModuleController.getAll);
router.get('/training-modules/:id', TrainingModuleController.getById);
router.get('/training-modules/department/:id', TrainingModuleController.getByDepartmentId);
router.get('/training-modules/name/:name', TrainingModuleController.getByName);
router.post('/training-modules', TrainingModuleController.create);
router.put('/training-modules/:id', TrainingModuleController.update);
router.delete('/training-modules/:id', TrainingModuleController.delete);

//view
router.get('/training-modules-view/condition', TrainingModuleViewController.getTrainingModuleViewByCondition);

module.exports = router;

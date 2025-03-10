const express = require('express');
const RelUserTrainingController = require('../controllers/relUserTrainingController');

const router = express.Router();

router.post('/rel-user-training', RelUserTrainingController.create);
router.get('/rel-user-training/:id', RelUserTrainingController.findById);
router.put('/rel-user-training/:id', RelUserTrainingController.update);
router.delete('/rel-user-training/:id', RelUserTrainingController.delete);
router.get('/rel-user-training', RelUserTrainingController.findAll);

module.exports = router;
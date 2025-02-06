const express = require('express');
const ChildTaskController = require('../controllers/childTaskController');

const router = express.Router();

router.get('/child-tasks', ChildTaskController.getAll);
router.get('/child-tasks/:id', ChildTaskController.getById);
router.post('/child-tasks', ChildTaskController.create);
router.put('/child-tasks/:id', ChildTaskController.update);
router.delete('/child-tasks/:id', ChildTaskController.delete);

module.exports = router;

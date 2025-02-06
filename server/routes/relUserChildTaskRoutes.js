const express = require('express');
const RelUserChildTaskController = require('../controllers/relUserChildTaskController');

const router = express.Router();

router.get('/rel-user-childtasks', RelUserChildTaskController.getAll);
router.get('/rel-user-childtasks/:id', RelUserChildTaskController.getById);
router.post('/rel-user-childtasks', RelUserChildTaskController.create);
router.put('/rel-user-childtasks/:id', RelUserChildTaskController.update);
router.delete('/rel-user-childtasks/:id', RelUserChildTaskController.delete);

module.exports = router;

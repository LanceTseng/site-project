const express = require('express');
const RelUserParentTaskController = require('../controllers/relUserParentTaskController');

const router = express.Router();

router.get('/rel-user-parenttasks', RelUserParentTaskController.getAll);
router.get('/rel-user-parenttasks/:id', RelUserParentTaskController.getById);
router.post('/rel-user-parenttasks', RelUserParentTaskController.create);
router.put('/rel-user-parenttasks/:id', RelUserParentTaskController.update);
router.delete('/rel-user-parenttasks/:id', RelUserParentTaskController.delete);

module.exports = router;

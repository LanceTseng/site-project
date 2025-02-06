const express = require('express');
const objectTypeController = require('../controllers/objectTypeController');

const router = express.Router();

router.get('/object-types', objectTypeController.getAll);
router.get('/object-types/:id', objectTypeController.getById);
router.get('/object-types/name/:name', objectTypeController.getByName);
router.post('/object-types', objectTypeController.create);
router.put('/object-types/:id', objectTypeController.update);
router.delete('/object-types/:id', objectTypeController.delete);

module.exports = router;

const express = require('express');
const BObjectTypeController = require('../controllers/objectTypeController');

const router = express.Router();

router.get('/object-types', BObjectTypeController.getAll);
router.get('/object-types/:id', BObjectTypeController.getById);
router.get('/object-types/name/:name', BObjectTypeController.getByName);
router.post('/object-types', BObjectTypeController.create);
router.put('/object-types/:id', BObjectTypeController.update);
router.delete('/object-types/:id', BObjectTypeController.delete);

module.exports = router;

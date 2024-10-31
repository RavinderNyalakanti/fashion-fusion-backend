const express = require('express');
const router = express.Router();
const accessoriesController = require('../controller/accessoriesController');

router.get('/', accessoriesController.getAllAccessories);
router.post('/', accessoriesController.createAccessory);
router.get('/:id', accessoriesController.getAccessoryById);
router.put('/:id', accessoriesController.updateAccessory);
router.delete('/:id', accessoriesController.deleteAccessory);

module.exports = router;

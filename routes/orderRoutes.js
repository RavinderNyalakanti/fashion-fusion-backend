const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router. put('/:id', orderController.updateOrder);

router.delete('/:productId/:userId', orderController.deleteOrder);

module.exports = router;
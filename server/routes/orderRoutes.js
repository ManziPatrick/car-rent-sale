const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, orderController.createOrder);
router.get('/', protect, isAdmin, orderController.getAllOrders);
router.get('/my', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/status', protect, isAdmin, orderController.updateOrderStatus);
router.put('/bulk-status', protect, isAdmin, orderController.bulkUpdateStatus);
router.delete('/:id', protect, isAdmin, orderController.deleteOrder);
router.post('/:id/contract', protect, orderController.generateContract);

module.exports = router; 
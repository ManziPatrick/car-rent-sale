const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getOne);
router.post('/', protect, isAdmin, categoryController.create);
router.put('/:id', protect, isAdmin, categoryController.update);
router.delete('/:id', protect, isAdmin, categoryController.delete);

module.exports = router; 
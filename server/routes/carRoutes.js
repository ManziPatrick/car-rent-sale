const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', carController.getAll);
router.get('/:id', carController.getOne);
router.post('/', protect, isAdmin, upload.array('images', 4), carController.create);
router.put('/:id', protect, isAdmin, upload.array('images', 4), carController.update);
router.delete('/:id', protect, isAdmin, carController.delete);

module.exports = router; 
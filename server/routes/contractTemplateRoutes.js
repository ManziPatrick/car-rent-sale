const express = require('express');
const router = express.Router();
const contractTemplateController = require('../controllers/contractTemplateController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Public routes (for users to view templates)
router.get('/type/:type', contractTemplateController.getTemplatesByType);
router.get('/:id', contractTemplateController.getTemplateById);

// Admin routes (require authentication)
router.get('/', auth.protect, contractTemplateController.getAllTemplates);
router.post('/', auth.protect, contractTemplateController.createTemplate);
router.put('/:id', auth.protect, contractTemplateController.updateTemplate);
router.delete('/:id', auth.protect, contractTemplateController.deleteTemplate);
router.post('/:id/upload-pdf', auth.protect, upload.single('pdf'), contractTemplateController.uploadPDF);
router.post('/generate', auth.protect, contractTemplateController.generateContract);

module.exports = router; 
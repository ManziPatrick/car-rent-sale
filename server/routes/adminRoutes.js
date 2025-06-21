const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin privileges
router.use(protect, isAdmin);

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

// Email templates
router.get('/email-templates', adminController.getEmailTemplates);
router.post('/email-templates', adminController.createEmailTemplate);
router.put('/email-templates/:id', adminController.updateEmailTemplate);
router.delete('/email-templates/:id', adminController.deleteEmailTemplate);

// Email notifications
router.get('/notifications', adminController.getNotifications);
router.post('/send-test-email/:templateId', adminController.sendTestEmail);
router.post('/send-bulk-email/:templateId', adminController.sendBulkEmail);

// User management
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router; 
const User = require('../models/User');
const Car = require('../models/Car');
const Order = require('../models/Order');
const Category = require('../models/Category');
const EmailTemplate = require('../models/EmailTemplate');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/emailService');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [cars, users, orders] = await Promise.all([
      Car.countDocuments(),
      User.countDocuments(),
      Order.countDocuments()
    ]);

    // Calculate total revenue from completed orders
    const completedOrders = await Order.find({ status: 'completed' });
    const revenue = completedOrders.reduce((total, order) => {
      const price = parseFloat(order.car?.price?.replace(/[^0-9.]/g, '') || 0);
      return total + price;
    }, 0);

    res.json({
      cars,
      users,
      orders,
      revenue: revenue.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

// Email template management
const getEmailTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching email templates' });
  }
};

const createEmailTemplate = async (req, res) => {
  try {
    const { name, subject, body, type } = req.body;
    const template = new EmailTemplate({ name, subject, body, type });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error creating email template' });
  }
};

const updateEmailTemplate = async (req, res) => {
  try {
    const { name, subject, body, type } = req.body;
    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      { name, subject, body, type },
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error updating email template' });
  }
};

const deleteEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting email template' });
  }
};

// Notification management
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('templateId')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

const sendTestEmail = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Send test email to admin
    const notification = new Notification({
      recipient: req.user.email,
      subject: template.subject,
      body: template.body,
      type: template.type,
      templateId: template._id,
      status: 'pending'
    });

    await notification.save();

    // Send the email
    await sendEmail(req.user.email, template.subject, template.body);
    
    notification.status = 'sent';
    await notification.save();

    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending test email' });
  }
};

const sendBulkEmail = async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const users = await User.find({ email: { $exists: true, $ne: '' } });
    const notifications = [];

    for (const user of users) {
      const notification = new Notification({
        recipient: user.email,
        subject: template.subject,
        body: template.body,
        type: template.type,
        templateId: template._id,
        status: 'pending'
      });
      notifications.push(notification);
    }

    await Notification.insertMany(notifications);

    // Send emails in background (you might want to use a queue system for this)
    for (const notification of notifications) {
      try {
        await sendEmail(notification.recipient, notification.subject, notification.body);
        notification.status = 'sent';
        await notification.save();
      } catch (error) {
        notification.status = 'failed';
        await notification.save();
      }
    }

    res.json({ message: `Bulk email sent to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ message: 'Error sending bulk email' });
  }
};

// User management
const updateUser = async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, isAdmin },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  getDashboardStats,
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getNotifications,
  sendTestEmail,
  sendBulkEmail,
  updateUser,
  deleteUser
}; 
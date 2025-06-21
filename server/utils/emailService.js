const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send order confirmation email
const sendOrderConfirmation = async (order) => {
  const subject = 'Order Confirmation - Car Rent & Sale';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Dear ${order.user.name},</p>
      <p>Your order has been confirmed successfully!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Car:</strong> ${order.car.brand} ${order.car.model}</p>
        <p><strong>Price:</strong> ${order.car.price}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
      
      <p>Thank you for choosing Car Rent & Sale!</p>
      <p>Best regards,<br>Car Rent & Sale Team</p>
    </div>
  `;

  return sendEmail(order.user.email, subject, html);
};

// Send order status update email
const sendOrderStatusUpdate = async (order) => {
  const subject = `Order Status Update - ${order.status.toUpperCase()}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Status Update</h2>
      <p>Dear ${order.user.name},</p>
      <p>Your order status has been updated.</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Car:</strong> ${order.car.brand} ${order.car.model}</p>
        <p><strong>New Status:</strong> ${order.status}</p>
        <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <p>Thank you for choosing Car Rent & Sale!</p>
      <p>Best regards,<br>Car Rent & Sale Team</p>
    </div>
  `;

  return sendEmail(order.user.email, subject, html);
};

// Send welcome email with generated password
const sendWelcomeWithPassword = async (to, password) => {
  const subject = 'Welcome to Car Rent & Sale - Your Account Details';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome!</h2>
      <p>Your account has been created. Here are your login details:</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>
      <p>You can now log in and manage your account.</p>
      <p>Best regards,<br>Car Rent & Sale Team</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendWelcomeWithPassword
}; 
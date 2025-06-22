const nodemailer = require('nodemailer');

// Create transporter with better Gmail configuration
const createTransporter = () => {
  // Check if email credentials are available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not found. Email functionality will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // This should be an App Password, not regular password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email function with better error handling
const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email not sent - transporter not available');
    return null;
  }

  try {
    const mailOptions = {
      from: `"Car Rent & Sale" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    // Don't throw error to prevent breaking the application
    return null;
  }
};

// Send order confirmation email with beautiful design
const sendOrderConfirmation = async (order) => {
  // Debug logging
  console.log('Sending order confirmation email for order:', {
    orderId: order._id,
    user: order.user?.name,
    car: order.car ? {
      title: order.car.title,
      brand: order.car.brand,
      model: order.car.model,
      year: order.car.year,
      salePrice: order.car.salePrice,
      rentPrice: order.car.rentPrice
    } : 'No car data',
    type: order.type,
    status: order.status
  });

  const subject = '🎉 Order Confirmation - Car Rent & Sale';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .order-details { background: #f8fafc; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #667eea; }
        .detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-row:last-child { border-bottom: none; }
        .label { font-weight: 600; color: #4a5568; }
        .value { color: #2d3748; }
        .status-badge { background: #48bb78; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #718096; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
        .car-image { width: 100px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px; }
        .car-info { display: flex; align-items: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p>Thank you for choosing Car Rent & Sale</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${order.user.name}</strong>,</p>
          <p>Your order has been confirmed successfully! We're excited to help you with your car needs.</p>
          
          <div class="order-details">
            <h3 style="margin-top: 0; color: #2d3748;">Order Details</h3>
            
            <div class="detail-row">
              <span class="label">Order ID:</span>
              <span class="value">#${order._id.toString().slice(-8).toUpperCase()}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Car:</span>
              <div class="car-info">
                <img src="${order.car?.image || order.car?.images?.[0] || ''}" alt="${order.car?.title || `${order.car?.brand || ''} ${order.car?.model || ''}`}" class="car-image" onerror="this.style.display='none'">
                <span class="value">${order.car?.title || `${order.car?.brand || ''} ${order.car?.model || ''} ${order.car?.year || ''}`.trim() || 'Car information unavailable'}</span>
              </div>
            </div>
            
            <div class="detail-row">
              <span class="label">Type:</span>
              <span class="value">${order.type === 'Buy' ? 'Purchase' : 'Rental'}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Price:</span>
              <span class="value">$${order.type === 'Buy' ? (order.car?.salePrice || 0).toLocaleString() : (order.car?.rentPrice || 0).toLocaleString()}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="status-badge">${order.status}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <p>Our team will contact you within 24 hours to arrange delivery or pickup details.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/account" class="button">View My Orders</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Car Rent & Sale!</p>
          <p>Best regards,<br><strong>Car Rent & Sale Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(order.user.email, subject, html);
};

// Send order status update email with beautiful design
const sendOrderStatusUpdate = async (order) => {
  const subject = `📋 Order Status Update - ${order.status.toUpperCase()}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .status-update { background: #ebf8ff; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #4299e1; }
        .status-badge { background: #4299e1; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #718096; }
        .button { display: inline-block; background: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Status Update</h1>
          <p>Your order status has been updated</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${order.user.name}</strong>,</p>
          <p>Your order status has been updated. Here are the latest details:</p>
          
          <div class="status-update">
            <h3 style="margin-top: 0; color: #2d3748;">Order Information</h3>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Car:</strong> ${order.car?.title || `${order.car?.brand || ''} ${order.car?.model || ''} ${order.car?.year || ''}`.trim() || 'Car information unavailable'}</p>
            <p><strong>New Status:</strong> <span class="status-badge">${order.status}</span></p>
            <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>We'll keep you updated on any further changes to your order.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/account" class="button">View Order Details</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Car Rent & Sale!</p>
          <p>Best regards,<br><strong>Car Rent & Sale Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(order.user.email, subject, html);
};

// Send welcome email with generated password - beautiful design
const sendWelcomeWithPassword = async (to, password) => {
  const subject = '🎉 Welcome to Car Rent & Sale - Your Account Details';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Car Rent & Sale</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .credentials { background: #f0fff4; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #48bb78; }
        .credential-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #c6f6d5; }
        .credential-row:last-child { border-bottom: none; }
        .label { font-weight: 600; color: #2f855a; }
        .value { color: #22543d; font-family: 'Courier New', monospace; background: #e6fffa; padding: 4px 8px; border-radius: 4px; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; color: #718096; }
        .button { display: inline-block; background: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
        .warning { background: #fed7d7; border: 1px solid #feb2b2; border-radius: 6px; padding: 15px; margin: 20px 0; color: #c53030; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome!</h1>
          <p>Your account has been created successfully</p>
        </div>
        
        <div class="content">
          <p>Welcome to <strong>Car Rent & Sale</strong>! Your account has been created and you can now access all our premium services.</p>
          
          <div class="credentials">
            <h3 style="margin-top: 0; color: #2f855a;">Your Login Credentials</h3>
            
            <div class="credential-row">
              <span class="label">Email:</span>
              <span class="value">${to}</span>
            </div>
            
            <div class="credential-row">
              <span class="label">Password:</span>
              <span class="value">${password}</span>
            </div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Note:</strong> Please change your password after your first login for better security.
          </div>
          
          <p>You can now log in and start exploring our premium car collection!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Login Now</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Car Rent & Sale!</p>
          <p>Best regards,<br><strong>Car Rent & Sale Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendWelcomeWithPassword
}; 
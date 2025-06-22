const Order = require('../models/Order');
const Car = require('../models/Car');
const PDFDocument = require('pdfkit');
const streamifier = require('streamifier');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../utils/emailService');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  try {
    const { car, type, withDriver, startDate, endDate } = req.body;
    const carDoc = await Car.findById(car);
    if (!carDoc) return res.status(404).json({ message: 'Car not found' });
    if (carDoc.status !== 'Available') return res.status(400).json({ message: 'Car not available' });
    
    // Update car status
    if (type === 'Buy') carDoc.status = 'Sold';
    if (type === 'Rent') carDoc.status = 'Rented';
    await carDoc.save();
    
    const order = await Order.create({
      user: req.user._id,
      car,
      type,
      withDriver,
      startDate,
      endDate,
      status: 'Pending',
    });

    // Populate user and car for email
    await order.populate('car user');
    
    // Send confirmation email
    try {
      await sendOrderConfirmation(order);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    // Return populated order data
    const populatedOrder = await Order.findById(order._id).populate('car user');
    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by type
    if (type) {
      query.type = type;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { _id: search },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } },
        { 'car.brand': { $regex: search, $options: 'i' } },
        { 'car.model': { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await Order.find(query)
      .populate('car user')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('car', 'title name brand model year image images salePrice rentPrice')
      .sort({ createdAt: -1 });
    
    // Filter out orders with missing car data and log for debugging
    const validOrders = orders.filter(order => {
      if (!order.car) {
        console.log(`Order ${order._id} has no car data`);
        return false;
      }
      return true;
    });
    
    // Log summary for debugging
    console.log(`User ${req.user._id}: Found ${orders.length} total orders, ${validOrders.length} with valid car data`);
    
    res.json(validOrders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('car user');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('car user');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (status === 'Completed' && !order.contractApproved) {
      return res.status(400).json({ message: 'Contract must be approved before completing the order.' });
    }
    order.status = status;
    await order.save();
    // Send status update email
    try {
      await sendOrderStatusUpdate(order);
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the request if email fails
    }
    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { orderIds, status } = req.body;
    
    const orders = await Order.find({ _id: { $in: orderIds } }).populate('car user');
    
    // Update all orders
    await Order.updateMany(
      { _id: { $in: orderIds } },
      { status }
    );
    
    // Send email notifications for each order - disabled to avoid Gmail auth issues
    // for (const order of orders) {
    //   try {
    //     await sendOrderStatusUpdate(order);
    //   } catch (emailError) {
    //     console.error(`Failed to send email for order ${order._id}:`, emailError);
    //   }
    // }
    
    res.json({ message: `${orders.length} orders updated successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Update car status back to available if it was rented/sold
    if (order.car) {
      const car = await Car.findById(order.car);
      if (car && (car.status === 'Rented' || car.status === 'Sold')) {
        car.status = 'Available';
        await car.save();
      }
    }
    
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateContract = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('car user');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Only admin or order owner
    if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Get contract data from request
    const { contractText } = req.body;
    
    // Generate PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      
      try {
        // Upload PDF to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = uploadToCloudinaryStream(resolve, reject);
          streamifier.createReadStream(pdfBuffer).pipe(stream);
        });
        
        // Email PDF to user
        await sendContractEmail(order.user.email, pdfBuffer);
        
        // Update order with contract URL
        order.contractUrl = uploadResult.secure_url;
        await order.save();
        
        res.json({ contractUrl: uploadResult.secure_url });
      } catch (error) {
        res.status(500).json({ message: 'Error generating contract' });
      }
    });
    
    // PDF content
    doc.fontSize(20).text('Car Rent/Sale Contract', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`User: ${order.user.name} (${order.user.email}, ${order.user.phone})`);
    doc.text(`Car: ${order.car.brand} ${order.car.model} (${order.car.year})`);
    doc.text(`Type: ${order.type}`);
    if (order.type === 'Rent') {
      doc.text(`Rental Dates: ${order.startDate?.toLocaleDateString()} to ${order.endDate?.toLocaleDateString()}`);
      doc.text(`With Driver: ${order.withDriver ? 'Yes' : 'No'}`);
    }
    doc.text(`Status: ${order.status}`);
    doc.moveDown();
    doc.text('Contract Terms:');
    doc.text(contractText || 'Standard terms and conditions apply.');
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

function uploadToCloudinaryStream(resolve, reject) {
  const cloudinary = require('cloudinary').v2;
  return cloudinary.uploader.upload_stream(
    { folder: 'car-rent-sale/contracts', resource_type: 'raw' },
    (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
  );
}

async function sendContractEmail(to, pdfBuffer) {
  const transporter = require('nodemailer').createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Car Rent/Sale Contract',
    text: 'Please find your contract attached.',
    attachments: [
      { filename: 'contract.pdf', content: pdfBuffer },
    ],
  });
}

// Admin: Approve contract for an order
exports.approveContract = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.contractApproved = true;
    await order.save();
    res.json({ message: 'Contract approved', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Debug endpoint to check orders with missing car references
exports.debugOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('car');
    const ordersWithMissingCars = orders.filter(order => !order.car);
    const ordersWithCars = orders.filter(order => order.car);
    
    res.json({
      totalOrders: orders.length,
      ordersWithCars: ordersWithCars.length,
      ordersWithMissingCars: ordersWithMissingCars.length,
      missingCarOrderIds: ordersWithMissingCars.map(order => order._id),
      sampleOrderWithCar: ordersWithCars[0] || null
    });
  } catch (err) {
    console.error('Error in debug orders:', err);
    res.status(500).json({ message: err.message });
  }
};

// Send order confirmation email (frontend callable)
exports.sendOrderConfirmation = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Fetch the actual order with populated car and user data
    const order = await Order.findById(orderId)
      .populate('car', 'title brand model year image images salePrice rentPrice')
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await sendOrderConfirmation(order);
    res.json({ message: 'Confirmation email sent successfully' });
  } catch (err) {
    console.error('Error sending confirmation email:', err);
    res.status(500).json({ message: 'Failed to send confirmation email' });
  }
}; 
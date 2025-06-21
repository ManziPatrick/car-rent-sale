const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  type: { type: String, enum: ['Rent', 'Buy'], required: true },
  withDriver: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  contractUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema); 
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  type: { type: String, enum: ['Rent', 'Buy'], required: true },
  withDriver: { type: Boolean, default: false },
  startDate: {
    type: Date,
    required: function() {
      return this.type === 'Rent';
    }
  },
  endDate: {
    type: Date,
    required: function() {
      return this.type === 'Rent';
    }
  },
  contractUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], default: 'Pending' },
  contractApproved: { type: Boolean, default: false },
}, { timestamps: true });

// Add validation for rental duration
orderSchema.pre('save', function(next) {
  if (this.type === 'Rent' && this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      return next(new Error('Rental duration cannot exceed 30 days (1 month)'));
    }

    if (this.endDate <= this.startDate) {
      return next(new Error('End date must be after start date'));
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema); 
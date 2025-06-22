const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  fuel: { type: String, required: true },
  mileage: { type: Number, required: true },
  transmission: { type: String, required: true },
  image: { type: String, required: true }, // for backward compatibility
  images: [{ type: String }], // new field for multiple images
  salePrice: { type: Number, required: true },
  rentPrice: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Sold', 'Rented'], default: 'Available' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  withDriver: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema); 
const Car = require('../models/Car');
const Category = require('../models/Category');
const fs = require('fs');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getAll = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { year: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }
    const cars = await Car.find(filter).populate('category');
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('category');
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    let imageUrl = req.body.image;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const car = await Car.create({ ...req.body, image: imageUrl });
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      updateData.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const car = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 
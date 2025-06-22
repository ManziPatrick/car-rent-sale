const Car = require('../models/Car');
const Category = require('../models/Category');
const fs = require('fs');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getAll = async (req, res) => {
  try {
    const { category, search, status, limit, page, sort } = req.query;
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

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOption = {};
    if (sort === 'price-asc') sortOption = { salePrice: 1 };
    else if (sort === 'price-desc') sortOption = { salePrice: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else sortOption = { createdAt: -1 }; // Default sort by newest

    const cars = await Car.find(filter)
      .populate('category')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Car.countDocuments(filter);

    res.json({
      cars,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
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
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        imageUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }
    const car = await Car.create({
      ...req.body,
      images: imageUrls,
      image: imageUrls[0] || ''
    });
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      let imageUrls = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        imageUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
      updateData.images = imageUrls;
      updateData.image = imageUrls[0] || '';
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
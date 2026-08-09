const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const { variety, search, available } = req.query;
    let filter = {};

    // Filter by company if authenticated
    if (req.user && req.companyId) {
      filter.companyId = req.companyId;
    }

    if (variety && variety !== 'all') {
      filter.variety = { $regex: variety, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (available === 'true') {
      filter.isAvailable = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ products, count: products.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check company if authenticated
    if (req.user && req.companyId && product.companyId && product.companyId.toString() !== req.companyId.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const { name, variety, ratePerKg, unit, description, stockQuantity, isAvailable } = req.body;

    if (!name || !variety || !ratePerKg) {
      return res.status(400).json({ message: 'Name, variety, and ratePerKg are required' });
    }

    let photoUrl = '';

    if (req.file) {
      if (cloudinary) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'hira-agro/products' });
        photoUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } else {
        photoUrl = '/uploads/' + req.file.filename;
      }
    }

    const product = await Product.create({
      name,
      variety,
      ratePerKg,
      unit,
      description,
      stockQuantity,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      photoUrl,
      companyId: req.companyId
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.companyId && product.companyId.toString() !== req.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    let photoUrl = product.photoUrl;

    if (req.file) {
      if (cloudinary) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'hira-agro/products' });
        photoUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } else {
        photoUrl = '/uploads/' + req.file.filename;
      }
    }

    const updatedData = { ...req.body, photoUrl };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.companyId && product.companyId.toString() !== req.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};

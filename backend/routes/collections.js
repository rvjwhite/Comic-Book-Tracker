const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Collection = require('../models/Collection');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `comic-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// @route   GET /api/collections
// @desc    Get all collections for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt', search } = req.query;

    const query = { userId: req.user._id };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { publisher: { $regex: search, $options: 'i' } },
        { issueNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const collections = await Collection.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Collection.countDocuments(query);

    res.json({
      success: true,
      collections,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/collections/:id
// @desc    Get single collection
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({
      success: true,
      collection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/collections
// @desc    Create new collection entry
// @access  Private
router.post('/', [protect, upload.single('image')], async (req, res) => {
  try {
    const collectionData = {
      ...req.body,
      userId: req.user._id
    };

    if (req.file) {
      collectionData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const collection = await Collection.create(collectionData);

    res.status(201).json({
      success: true,
      collection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/collections/:id
// @desc    Update collection entry
// @access  Private
router.put('/:id', [protect, upload.single('image')], async (req, res) => {
  try {
    let collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    collection = await Collection.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      collection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/collections/:id
// @desc    Delete collection entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    await Collection.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/collections/stats/summary
// @desc    Get collection statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user._id });

    const stats = {
      totalItems: collections.length,
      totalValue: collections.reduce((sum, item) => sum + item.currentValue, 0),
      totalInvested: collections.reduce((sum, item) => sum + item.purchasePrice, 0),
      nftMinted: collections.filter(item => item.isMintedAsNFT).length,
      byPublisher: {},
      byCondition: {}
    };

    collections.forEach(item => {
      // Count by publisher
      stats.byPublisher[item.publisher] = (stats.byPublisher[item.publisher] || 0) + 1;

      // Count by condition
      stats.byCondition[item.condition] = (stats.byCondition[item.condition] || 0) + 1;
    });

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `comic-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  },
});

// GET /api/collections  - list with search & pagination
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [{ title: re }, { publisher: re }, { issueNumber: re }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [collections, total] = await Promise.all([
      db.collections.find(query, { createdAt: -1 }, skip, parseInt(limit)),
      db.collections.count(query),
    ]);

    res.json({
      success: true,
      collections,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/collections/stats/summary
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const all = await db.collections.find({ userId: req.user._id });
    const stats = {
      totalItems: all.length,
      totalValue: all.reduce((s, c) => s + (c.currentValue || 0), 0),
      totalInvested: all.reduce((s, c) => s + (c.purchasePrice || 0), 0),
      nftMinted: all.filter((c) => c.isMintedAsNFT).length,
      byPublisher: {},
      byCondition: {},
    };
    all.forEach((c) => {
      stats.byPublisher[c.publisher] = (stats.byPublisher[c.publisher] || 0) + 1;
      stats.byCondition[c.condition] = (stats.byCondition[c.condition] || 0) + 1;
    });
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/collections/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const comic = await db.collections.findOne({ _id: req.params.id, userId: req.user._id });
    if (!comic) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, collection: comic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/collections
router.post('/', [protect, upload.single('image')], async (req, res) => {
  try {
    const data = {
      ...req.body,
      userId: req.user._id,
      grade: req.body.grade ? parseFloat(req.body.grade) : null,
      purchasePrice: parseFloat(req.body.purchasePrice) || 0,
      currentValue: parseFloat(req.body.currentValue) || parseFloat(req.body.purchasePrice) || 0,
      isMintedAsNFT: false,
      nftTokenId: null,
      nftContractAddress: null,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAppraised: new Date(),
    };
    const comic = await db.collections.insert(data);
    res.status(201).json({ success: true, collection: comic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/collections/:id
router.put('/:id', [protect, upload.single('image')], async (req, res) => {
  try {
    const existing = await db.collections.findOne({ _id: req.params.id, userId: req.user._id });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const update = { ...req.body, updatedAt: new Date() };
    if (req.file) update.imageUrl = `/uploads/${req.file.filename}`;
    if (update.grade) update.grade = parseFloat(update.grade);
    if (update.purchasePrice) update.purchasePrice = parseFloat(update.purchasePrice);
    if (update.currentValue) update.currentValue = parseFloat(update.currentValue);

    const updated = await db.collections.update({ _id: req.params.id }, { $set: update });
    res.json({ success: true, collection: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/collections/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const num = await db.collections.remove({ _id: req.params.id, userId: req.user._id });
    if (!num) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

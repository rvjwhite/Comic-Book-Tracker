const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const { protect } = require('../middleware/auth');
const axios = require('axios');

// Condition multipliers for appraisal
const conditionMultipliers = {
  'Poor': 0.2,
  'Fair': 0.4,
  'Good': 0.6,
  'Very Good': 0.8,
  'Fine': 1.0,
  'Very Fine': 1.3,
  'Near Mint': 1.6,
  'Mint': 2.0
};

// @route   GET /api/appraisal/:id
// @desc    Get appraisal for a specific comic
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection item not found' });
    }

    // Calculate estimated value based on condition
    const baseValue = collection.purchasePrice > 0 ? collection.purchasePrice : 10;
    const conditionMultiplier = conditionMultipliers[collection.condition] || 1.0;

    // Add grading premium if professionally graded
    let gradingPremium = 1.0;
    if (collection.gradingCompany !== 'None' && collection.grade) {
      gradingPremium = 1.0 + (collection.grade / 10) * 0.5; // Up to 50% premium for 10.0 grade
    }

    const estimatedValue = baseValue * conditionMultiplier * gradingPremium;

    // Calculate market trends (simplified - in production, use real market data APIs)
    const marketTrend = calculateMarketTrend(collection);

    const appraisal = {
      collectionId: collection._id,
      title: collection.title,
      issueNumber: collection.issueNumber,
      condition: collection.condition,
      grade: collection.grade,
      gradingCompany: collection.gradingCompany,
      purchasePrice: collection.purchasePrice,
      currentValue: collection.currentValue,
      estimatedValue: Math.round(estimatedValue * 100) / 100,
      conditionMultiplier,
      gradingPremium,
      marketTrend,
      lastAppraised: new Date(),
      confidence: calculateConfidence(collection)
    };

    res.json({
      success: true,
      appraisal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/appraisal/:id/update
// @desc    Update collection value based on appraisal
// @access  Private
router.post('/:id/update', protect, async (req, res) => {
  try {
    const { estimatedValue } = req.body;

    const collection = await Collection.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      {
        currentValue: estimatedValue,
        lastAppraised: new Date()
      },
      { new: true }
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection item not found' });
    }

    res.json({
      success: true,
      collection
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/appraisal/batch
// @desc    Appraise multiple comics at once
// @access  Private
router.post('/batch', protect, async (req, res) => {
  try {
    const { collectionIds } = req.body;

    if (!Array.isArray(collectionIds) || collectionIds.length === 0) {
      return res.status(400).json({ error: 'Collection IDs array is required' });
    }

    const collections = await Collection.find({
      _id: { $in: collectionIds },
      userId: req.user._id
    });

    const appraisals = collections.map(collection => {
      const baseValue = collection.purchasePrice > 0 ? collection.purchasePrice : 10;
      const conditionMultiplier = conditionMultipliers[collection.condition] || 1.0;

      let gradingPremium = 1.0;
      if (collection.gradingCompany !== 'None' && collection.grade) {
        gradingPremium = 1.0 + (collection.grade / 10) * 0.5;
      }

      const estimatedValue = baseValue * conditionMultiplier * gradingPremium;

      return {
        collectionId: collection._id,
        title: collection.title,
        estimatedValue: Math.round(estimatedValue * 100) / 100
      };
    });

    res.json({
      success: true,
      appraisals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/appraisal/market/:publisher/:title
// @desc    Get market data for specific comic (placeholder for external API integration)
// @access  Private
router.get('/market/:publisher/:title', protect, async (req, res) => {
  try {
    const { publisher, title } = req.params;

    // Placeholder for external API integration
    // In production, integrate with APIs like:
    // - GoCollect API
    // - MyComicShop API
    // - GPAnalysis API

    const marketData = {
      publisher,
      title,
      averagePrice: 0,
      recentSales: [],
      trend: 'stable',
      note: 'External API integration required for real market data'
    };

    res.json({
      success: true,
      marketData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function calculateMarketTrend(collection) {
  // Simplified market trend calculation
  // In production, use historical data and external APIs
  const daysSincePurchase = Math.floor((Date.now() - collection.purchaseDate) / (1000 * 60 * 60 * 24));

  if (collection.currentValue > collection.purchasePrice * 1.2) {
    return 'rising';
  } else if (collection.currentValue < collection.purchasePrice * 0.8) {
    return 'declining';
  }
  return 'stable';
}

function calculateConfidence(collection) {
  // Calculate confidence level based on data availability
  let confidence = 50; // Base confidence

  if (collection.gradingCompany !== 'None') confidence += 20;
  if (collection.grade) confidence += 10;
  if (collection.publicationDate) confidence += 10;
  if (collection.lastAppraised) {
    const daysSinceAppraisal = Math.floor((Date.now() - collection.lastAppraised) / (1000 * 60 * 60 * 24));
    if (daysSinceAppraisal < 30) confidence += 10;
  }

  return Math.min(confidence, 100);
}

module.exports = router;

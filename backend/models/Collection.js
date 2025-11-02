const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Comic title is required'],
    trim: true
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true
  },
  issueNumber: {
    type: String,
    required: [true, 'Issue number is required'],
    trim: true
  },
  variant: {
    type: String,
    default: 'Regular Edition',
    trim: true
  },
  publicationDate: {
    type: Date
  },
  condition: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Very Good', 'Fine', 'Very Fine', 'Near Mint', 'Mint'],
    default: 'Very Good'
  },
  gradingCompany: {
    type: String,
    enum: ['CGC', 'CBCS', 'PGX', 'None', 'Other'],
    default: 'None'
  },
  grade: {
    type: Number,
    min: 0.5,
    max: 10,
    default: null
  },
  purchasePrice: {
    type: Number,
    default: 0,
    min: 0
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0
  },
  lastAppraised: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    default: null
  },
  nftTokenId: {
    type: Number,
    default: null
  },
  nftContractAddress: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid contract address'
    }
  },
  isMintedAsNFT: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: '',
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
collectionSchema.index({ userId: 1, title: 1 });
collectionSchema.index({ userId: 1, publisher: 1 });
collectionSchema.index({ nftTokenId: 1 }, { sparse: true });

// Update timestamp on update
collectionSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Virtual for value change
collectionSchema.virtual('valueChange').get(function() {
  if (this.purchasePrice === 0) return 0;
  return this.currentValue - this.purchasePrice;
});

collectionSchema.virtual('valueChangePercent').get(function() {
  if (this.purchasePrice === 0) return 0;
  return ((this.currentValue - this.purchasePrice) / this.purchasePrice) * 100;
});

// Ensure virtuals are included in JSON
collectionSchema.set('toJSON', { virtuals: true });
collectionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Collection', collectionSchema);

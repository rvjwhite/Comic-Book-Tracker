const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/auth');

// @route   POST /api/nft/mint/:collectionId
// @desc    Mint NFT for a comic book (records intent - actual minting done on frontend)
// @access  Private
router.post('/mint/:collectionId', protect, async (req, res) => {
  try {
    const { tokenId, contractAddress, transactionHash } = req.body;

    const collection = await db.collections.findOne({
      _id: req.params.collectionId,
      userId: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection item not found' });
    }

    if (collection.isMintedAsNFT) {
      return res.status(400).json({ error: 'This item is already minted as NFT' });
    }

    await db.collections.update(
      { _id: req.params.collectionId },
      { $set: { nftTokenId: tokenId, nftContractAddress: contractAddress, isMintedAsNFT: true, updatedAt: new Date() } }
    );

    res.json({
      success: true,
      message: 'NFT minting recorded successfully',
      collection,
      transactionHash
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/nft/transfer
// @desc    Record NFT transfer (actual transfer done on blockchain)
// @access  Private
router.post('/transfer', protect, async (req, res) => {
  try {
    const { tokenId, contractAddress, newOwner, transactionHash } = req.body;

    const collection = await db.collections.findOne({
      nftTokenId: tokenId,
      nftContractAddress: contractAddress,
      userId: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'NFT not found in your collection' });
    }

    // In a production system, you might want to:
    // 1. Verify the transaction on the blockchain
    // 2. Transfer the database record to the new owner
    // 3. Update ownership history

    res.json({
      success: true,
      message: 'NFT transfer recorded',
      transactionHash,
      note: 'Ownership should be verified on blockchain'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/nft/verify/:tokenId
// @desc    Verify NFT ownership
// @access  Public
router.get('/verify/:tokenId', async (req, res) => {
  try {
    const { contractAddress } = req.query;

    const collection = await db.collections.findOne({
      nftTokenId: parseInt(req.params.tokenId),
      nftContractAddress: contractAddress
    });

    if (!collection) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    const owner = await db.users.findOne({ _id: collection.userId });
    res.json({
      success: true,
      nft: {
        tokenId: collection.nftTokenId,
        contractAddress: collection.nftContractAddress,
        title: collection.title,
        publisher: collection.publisher,
        issueNumber: collection.issueNumber,
        condition: collection.condition,
        imageUrl: collection.imageUrl,
        owner: {
          username: owner ? owner.username : 'Unknown',
          walletAddress: owner ? owner.walletAddress : null
        },
        mintedAt: collection.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/nft/metadata/:tokenId
// @desc    Get NFT metadata (ERC-721 standard)
// @access  Public
router.get('/metadata/:tokenId', async (req, res) => {
  try {
    const { contractAddress } = req.query;

    const collection = await db.collections.findOne({
      nftTokenId: parseInt(req.params.tokenId),
      nftContractAddress: contractAddress
    });

    if (!collection) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    // Return ERC-721 compliant metadata
    const metadata = {
      name: `${collection.title} #${collection.issueNumber}`,
      description: `${collection.publisher} - ${collection.title} Issue ${collection.issueNumber}. Condition: ${collection.condition}${collection.grade ? `, Grade: ${collection.grade}` : ''}`,
      image: collection.imageUrl ? `${process.env.BASE_URL || 'http://localhost:5000'}${collection.imageUrl}` : '',
      attributes: [
        {
          trait_type: 'Publisher',
          value: collection.publisher
        },
        {
          trait_type: 'Issue Number',
          value: collection.issueNumber
        },
        {
          trait_type: 'Condition',
          value: collection.condition
        },
        {
          trait_type: 'Variant',
          value: collection.variant
        }
      ]
    };

    if (collection.grade) {
      metadata.attributes.push({
        trait_type: 'Grade',
        display_type: 'number',
        value: collection.grade
      });
    }

    if (collection.publicationDate) {
      metadata.attributes.push({
        trait_type: 'Publication Year',
        display_type: 'date',
        value: collection.publicationDate.getFullYear()
      });
    }

    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/nft/user/minted
// @desc    Get all minted NFTs for logged in user
// @access  Private
router.get('/user/minted', protect, async (req, res) => {
  try {
    const mintedCollections = await db.collections.find({
      userId: req.user._id,
      isMintedAsNFT: true
    });

    res.json({
      success: true,
      count: mintedCollections.length,
      nfts: mintedCollections
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

# Quick Start Guide

Get Comic Book Tracker up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB running (or MongoDB Atlas account)
- MetaMask browser extension (for NFT features)

## Installation

### Option 1: Automated Setup (Recommended)

**macOS/Linux:**
```bash
./setup.sh
```

**Windows:**
```bash
setup.bat
```

This will:
- Install all dependencies
- Create environment files
- Compile smart contracts
- Set up uploads directory

### Option 2: Manual Setup

```bash
# Install dependencies
npm run install:all

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp contracts/.env.example contracts/.env

# Compile contracts
cd contracts && npx hardhat compile && cd ..
```

## Configuration

### 1. Configure Backend (.env)

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/comic-book-tracker
JWT_SECRET=your-super-secret-key-here
PORT=5000
```

**Using MongoDB Atlas?** Get your connection string from Atlas dashboard.

### 2. Deploy Smart Contract

```bash
./scripts/deploy-local.sh
```

Or manually:
```bash
cd contracts
npx hardhat run scripts/deploy.js
```

Copy the contract address that's printed.

### 3. Configure Frontend (.env)

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=<paste-contract-address-here>
VITE_CHAIN_ID=1337
```

## Seed Sample Data (Optional)

Add demo comics to test with:

```bash
cd backend
node seed.js
```

**Demo credentials:**
- Email: `demo@example.com`
- Password: `demo123`

## Start the Application

### Option 1: Start Everything Together

```bash
npm run dev
```

### Option 2: Start Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Access the Application

Open your browser to:
```
http://localhost:5173
```

Backend API is at:
```
http://localhost:5000
```

## First Steps

### 1. Create an Account

- Click "Register here"
- Fill in username, email, password
- Click "Register"

### 2. Connect Your Wallet (Optional)

- Click "Connect Wallet" in navbar
- Approve connection in MetaMask
- Your wallet address will appear

### 3. Add Your First Comic

- Click "Add Comic" in navbar
- Fill in comic details:
  - Title: "Amazing Spider-Man"
  - Publisher: "Marvel"
  - Issue Number: "1"
  - Condition: "Near Mint"
  - Purchase Price: 100
- Click "Add to Collection"

### 4. Appraise Value

- Click on your comic in the collection
- Click "Appraise Value"
- Review estimated value
- Click "Update Current Value" to accept

### 5. Mint as NFT

- Make sure wallet is connected
- On comic detail page, click "Mint as NFT"
- Approve transaction in MetaMask
- Wait for confirmation

## Common Issues

### MongoDB Connection Error

**Problem:** Backend can't connect to MongoDB

**Solution:**
- Check MongoDB is running: `mongosh` or `mongo`
- Start MongoDB: `brew services start mongodb-community` (macOS)
- Or use MongoDB Atlas cloud database

### Port Already in Use

**Problem:** Port 5000 or 5173 already in use

**Solution:**
- Change PORT in `backend/.env`
- Change port in `frontend/vite.config.js`
- Or kill the process: `lsof -ti:5000 | xargs kill`

### MetaMask Not Connecting

**Problem:** Wallet won't connect

**Solution:**
- Refresh the page
- Check MetaMask is unlocked
- Try disconnecting and reconnecting
- Make sure you're on localhost:8545 network

### Contract Deployment Failed

**Problem:** Smart contract won't deploy

**Solution:**
```bash
cd contracts
rm -rf cache artifacts
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/deploy.js
```

## Verify Everything Works

Run the environment checker:

```bash
node scripts/check-env.js
```

This checks all environment variables are configured correctly.

## What's Next?

- Read the full [README.md](README.md) for all features
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- See [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Read [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Need Help?

- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Review [Troubleshooting](README.md#troubleshooting) section
- Open an issue on GitHub

## Production Deployment

For production deployment:

1. **Backend**: Deploy to Heroku, AWS, or similar
2. **Frontend**: Deploy to Vercel, Netlify
3. **Database**: Use MongoDB Atlas
4. **Smart Contract**: Deploy to testnet first, then mainnet

See [README.md](README.md#deployment) for details.

---

**Ready to start tracking your comic collection!** 📚🚀

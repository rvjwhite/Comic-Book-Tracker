# Setup Guide - Comic Book Tracker

This guide provides step-by-step instructions for setting up the Comic Book Tracker application on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm**: Usually comes with Node.js
  - Verify installation: `npm --version`

- **MongoDB**: Version 5.x or higher
  - Option 1: Local installation from https://www.mongodb.com/try/download/community
  - Option 2: Use MongoDB Atlas (cloud database) - https://www.mongodb.com/cloud/atlas

- **Git**: For version control
  - Download from: https://git-scm.com/

- **MetaMask**: Browser extension for Web3 features
  - Install from: https://metamask.io/

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Comic-Book-Tracker
```

### 2. Install Dependencies

Install all dependencies for the root, backend, frontend, and contracts:

```bash
npm run install:all
```

This command will:
- Install root package dependencies
- Install backend dependencies
- Install frontend dependencies
- Install smart contract dependencies

### 3. Set Up MongoDB

#### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
   - **Windows**: Start MongoDB from Services

3. Verify MongoDB is running:
   ```bash
   mongosh
   # or
   mongo
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### 4. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Use one of these:
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/comic-book-tracker

# MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/comic-book-tracker

# JWT Secret - Generate a random string
JWT_SECRET=your-super-secret-jwt-key-change-this

# JWT Expiration
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

Create uploads directory:
```bash
mkdir uploads
```

### 5. Configure Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=
VITE_CHAIN_ID=1337
```

Note: `VITE_CONTRACT_ADDRESS` will be filled after deploying the smart contract.

### 6. Set Up Smart Contracts

```bash
cd ../contracts
cp .env.example .env
```

Edit `.env` file:

```env
# For local development (Hardhat network):
# No configuration needed for local testing

# For testnet deployment (Sepolia):
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-INFURA-PROJECT-ID
PRIVATE_KEY=your-wallet-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key

# Base URI for NFT metadata
BASE_TOKEN_URI=http://localhost:5000/api/nft/metadata/
```

**Security Warning**: Never commit your `.env` file with real private keys!

### 7. Compile and Test Smart Contracts

```bash
# Still in contracts directory
npm install
npx hardhat compile
npx hardhat test
```

You should see all tests passing.

### 8. Deploy Smart Contracts

#### Local Development (Hardhat Network):

```bash
npx hardhat run scripts/deploy.js
```

This will:
- Deploy the contract to local Hardhat network
- Display the contract address
- Save deployment information

Copy the contract address and update `frontend/.env`:
```env
VITE_CONTRACT_ADDRESS=<deployed-contract-address>
```

#### Deploy to Sepolia Testnet (Optional):

1. Get Sepolia ETH from faucet:
   - https://sepoliafaucet.com/
   - https://faucet.sepolia.dev/

2. Deploy:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. Update frontend `.env` with the new contract address

### 9. Start the Application

Open three terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in X ms
Local: http://localhost:5173
```

**Terminal 3 - Local Blockchain (Optional, for testing NFTs):**
```bash
cd contracts
npx hardhat node
```

### 10. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the Comic Book Tracker login page.

## First Time Use

### Create an Account

1. Click "Register here" on the login page
2. Fill in:
   - Username
   - Email
   - Password
3. Click "Register"
4. You'll be automatically logged in

### Connect MetaMask (For NFT Features)

1. Install MetaMask extension if not already installed
2. Click "Connect Wallet" in the navigation bar
3. Approve the connection in MetaMask
4. Your wallet address will appear in the navigation

### Add Your First Comic

1. Click "Add Comic" in the navigation
2. Fill in the form with comic details
3. Click "Add to Collection"
4. View your comic in the collection page

## Verification

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}
```

### Test MongoDB Connection

```bash
mongosh
use comic-book-tracker
show collections
```

You should see collections like `users` and `collections` after creating an account.

### Test Smart Contract

```bash
cd contracts
npx hardhat test
```

All tests should pass.

## Common Setup Issues

### Issue: MongoDB Connection Error

**Solution:**
- Verify MongoDB is running: `mongosh`
- Check your MONGODB_URI in backend/.env
- For Atlas, verify IP whitelist settings

### Issue: Port Already in Use

**Solution:**
- Backend: Change PORT in backend/.env
- Frontend: Change port in frontend/vite.config.js
- Or kill the process using the port:
  - Find process: `lsof -i :5000` (or :5173)
  - Kill process: `kill -9 <PID>`

### Issue: Smart Contract Deployment Failed

**Solution:**
- Ensure Hardhat is compiled: `npx hardhat compile`
- Check for sufficient funds in wallet
- Verify RPC URL is correct
- Try restarting Hardhat node

### Issue: MetaMask Not Connecting

**Solution:**
- Refresh the page
- Check if MetaMask is unlocked
- Ensure you're on the correct network (localhost:8545 for local development)
- Try disconnecting and reconnecting

### Issue: CORS Errors

**Solution:**
- Verify FRONTEND_URL in backend/.env
- Check CORS configuration in backend/server.js
- Clear browser cache

## Next Steps

After successful setup:

1. **Read the main README.md** for usage instructions
2. **Explore the API Documentation** in README.md
3. **Test the appraisal feature** by adding comics
4. **Try minting an NFT** with MetaMask connected
5. **Check the dashboard** for collection analytics

## Development Tips

### Running in Development Mode

Use the root package.json for convenience:
```bash
# Run both backend and frontend concurrently
npm run dev
```

### Watching for Changes

- Backend: Automatically restarts with nodemon
- Frontend: Hot-reloads with Vite HMR
- Smart Contracts: Run tests with `--watch` flag

### Database Management

View database contents:
```bash
mongosh
use comic-book-tracker
db.collections.find().pretty()
db.users.find().pretty()
```

Reset database:
```bash
mongosh
use comic-book-tracker
db.dropDatabase()
```

## Support

If you encounter issues not covered here:
1. Check the main README.md troubleshooting section
2. Review error logs in the terminal
3. Check browser console for frontend errors
4. Open an issue on GitHub with details

## Security Reminders

- Never commit `.env` files
- Use strong passwords and JWT secrets
- Keep private keys secure
- Use testnets before mainnet
- Regularly update dependencies

Happy collecting!

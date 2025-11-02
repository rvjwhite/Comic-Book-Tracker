#!/bin/bash

echo "🚀 Comic Book Tracker - Quick Start Script"
echo "=========================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check for MongoDB
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB CLI not found. Make sure MongoDB is installed and running."
    echo "   Or use MongoDB Atlas cloud database."
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install contracts dependencies
echo "Installing contracts dependencies..."
cd contracts
npm install
cd ..

echo ""
echo "⚙️  Setting up environment files..."
echo ""

# Setup backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env (please configure it)"
else
    echo "⚠️  backend/.env already exists"
fi

# Setup frontend .env
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env (please configure it)"
else
    echo "⚠️  frontend/.env already exists"
fi

# Setup contracts .env
if [ ! -f contracts/.env ]; then
    cp contracts/.env.example contracts/.env
    echo "✅ Created contracts/.env (please configure it)"
else
    echo "⚠️  contracts/.env already exists"
fi

# Create uploads directory
mkdir -p backend/uploads

echo ""
echo "🔨 Compiling smart contracts..."
echo ""
cd contracts
npx hardhat compile
cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure your environment files:"
echo "   - backend/.env (set MongoDB URI and JWT secret)"
echo "   - frontend/.env (will update after contract deployment)"
echo "   - contracts/.env (if deploying to testnet)"
echo ""
echo "2. Start MongoDB (if using local):"
echo "   - macOS: brew services start mongodb-community"
echo "   - Linux: sudo systemctl start mongod"
echo "   - Windows: Start MongoDB from Services"
echo ""
echo "3. Seed the database with sample data (optional):"
echo "   cd backend && node seed.js"
echo ""
echo "4. Deploy smart contract (local):"
echo "   cd contracts && npx hardhat run scripts/deploy.js"
echo "   Then update frontend/.env with the contract address"
echo ""
echo "5. Start the application:"
echo "   npm run dev"
echo ""
echo "   Or start services separately:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "6. Access the app at http://localhost:5173"
echo ""
echo "📚 For detailed instructions, see SETUP_GUIDE.md"
echo ""

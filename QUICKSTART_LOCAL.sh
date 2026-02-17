#!/bin/bash
# Quick start script for local development

set -e  # Exit on any error

echo "🚀 Comic Book Tracker - Local Setup"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js detected: $NODE_VERSION"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "Creating backend/.env file..."
    cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
JWT_SECRET=comic-secret-key-2024
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
EOF
    echo "✅ Created backend/.env"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo "✅ Backend dependencies installed"
fi

# Check if database exists
if [ ! -f "data/users.db" ] || [ ! -f "data/comics.db" ]; then
    echo "Seeding database with demo data..."
    node seed.js
    echo "✅ Database seeded"
else
    echo "ℹ️  Database already exists (delete data/*.db to reseed)"
fi

cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend

if [ ! -f ".env" ]; then
    echo "Creating frontend/.env file..."
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
VITE_CHAIN_ID=1337
EOF
    echo "✅ Created frontend/.env"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Start the backend (in this terminal):"
echo "   cd backend && node server.js"
echo ""
echo "2. Start the frontend (in a NEW terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "📧 Demo login: demo@example.com / demo123"
echo ""
echo "⚠️  IMPORTANT: Keep BOTH terminals running!"

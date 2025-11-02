#!/bin/bash

echo "🚀 Starting Comic Book Tracker in Development Mode"
echo ""

# Check if .env files exist
if [ ! -f backend/.env ]; then
    echo "❌ backend/.env not found. Run setup.sh first!"
    exit 1
fi

if [ ! -f frontend/.env ]; then
    echo "❌ frontend/.env not found. Run setup.sh first!"
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null && ! nc -z localhost 27017 > /dev/null 2>&1; then
    echo "⚠️  Warning: MongoDB may not be running on localhost:27017"
    echo "   Make sure MongoDB is started or using MongoDB Atlas"
    echo ""
fi

echo "Starting backend and frontend servers..."
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Use npm run dev from root (uses concurrently)
npm run dev

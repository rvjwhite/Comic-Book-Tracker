#!/bin/bash

echo "🔗 Deploying Smart Contract Locally"
echo "===================================="
echo ""

cd contracts

echo "1. Compiling contracts..."
npx hardhat compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed"
    exit 1
fi

echo ""
echo "2. Running tests..."
npx hardhat test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo ""
echo "3. Deploying to local network..."
DEPLOYMENT_OUTPUT=$(npx hardhat run scripts/deploy.js)

echo "$DEPLOYMENT_OUTPUT"

# Extract contract address from deployment output
CONTRACT_ADDRESS=$(echo "$DEPLOYMENT_OUTPUT" | grep "ComicBookNFT deployed to:" | awk '{print $4}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo ""
    echo "❌ Failed to extract contract address"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "Contract Address: $CONTRACT_ADDRESS"
echo ""
echo "Updating frontend/.env..."

cd ..

# Update frontend .env
if [ -f frontend/.env ]; then
    # Check if VITE_CONTRACT_ADDRESS exists in .env
    if grep -q "VITE_CONTRACT_ADDRESS=" frontend/.env; then
        # Replace the existing value
        sed -i.bak "s|VITE_CONTRACT_ADDRESS=.*|VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS|" frontend/.env
        rm frontend/.env.bak 2>/dev/null
    else
        # Add the variable
        echo "VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> frontend/.env
    fi
    echo "✅ Updated frontend/.env with contract address"
else
    echo "⚠️  frontend/.env not found. Please create it and add:"
    echo "   VITE_CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
fi

echo ""
echo "🎉 All done! You can now start the application:"
echo "   npm run dev"
echo ""

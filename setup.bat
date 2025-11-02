@echo off
echo 🚀 Comic Book Tracker - Quick Start Script
echo ==========================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js version:
node --version

echo.
echo 📦 Installing dependencies...
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Install contracts dependencies
echo Installing contracts dependencies...
cd contracts
call npm install
cd ..

echo.
echo ⚙️  Setting up environment files...
echo.

REM Setup backend .env
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo ✅ Created backend/.env (please configure it)
) else (
    echo ⚠️  backend/.env already exists
)

REM Setup frontend .env
if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
    echo ✅ Created frontend/.env (please configure it)
) else (
    echo ⚠️  frontend/.env already exists
)

REM Setup contracts .env
if not exist contracts\.env (
    copy contracts\.env.example contracts\.env
    echo ✅ Created contracts/.env (please configure it)
) else (
    echo ⚠️  contracts/.env already exists
)

REM Create uploads directory
if not exist backend\uploads mkdir backend\uploads

echo.
echo 🔨 Compiling smart contracts...
echo.
cd contracts
call npx hardhat compile
cd ..

echo.
echo ✅ Setup Complete!
echo.
echo 📋 Next Steps:
echo.
echo 1. Configure your environment files:
echo    - backend/.env (set MongoDB URI and JWT secret)
echo    - frontend/.env (will update after contract deployment)
echo    - contracts/.env (if deploying to testnet)
echo.
echo 2. Start MongoDB (if using local):
echo    - Start MongoDB from Windows Services
echo    - Or use MongoDB Atlas cloud database
echo.
echo 3. Seed the database with sample data (optional):
echo    cd backend
echo    node seed.js
echo.
echo 4. Deploy smart contract (local):
echo    cd contracts
echo    npx hardhat run scripts/deploy.js
echo    Then update frontend/.env with the contract address
echo.
echo 5. Start the application:
echo    npm run dev
echo.
echo    Or start services separately:
echo    - Backend: cd backend ^&^& npm run dev
echo    - Frontend: cd frontend ^&^& npm run dev
echo.
echo 6. Access the app at http://localhost:5173
echo.
echo 📚 For detailed instructions, see SETUP_GUIDE.md
echo.
pause

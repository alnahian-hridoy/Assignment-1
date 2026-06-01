@echo off
REM Quiz Management Portal - Quick Start Guide for Windows

echo.
echo ==========================================
echo   Quiz Management Portal - Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js first.
    echo   Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version

echo [OK] npm version:
npm --version
echo.

REM Backend Setup
echo. Setting up Backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
)

REM Check for .env file
if not exist ".env" (
    echo.
    echo [WARNING] .env file not found in backend\
    echo Creating template .env file...
    (
        echo PORT=5001
        echo MONGODB_URI=mongodb://localhost:27017/quiz-portal
        echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
        echo NODE_ENV=development
    ) > .env
    echo [OK] Created .env file - Please update with your MongoDB URI
) else (
    echo [OK] .env file already exists
)

cd ..
echo.

REM Frontend Setup
echo. Setting up Frontend...
cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

REM Check for .env file
if not exist ".env" (
    echo.
    echo [WARNING] .env file not found in frontend\
    echo Creating template .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5001
    ) > .env
    echo [OK] Created .env file
) else (
    echo [OK] .env file already exists
)

cd ..
echo.

echo ==========================================
echo   [OK] Setup Complete!
echo ==========================================
echo.
echo Next Steps:
echo.
echo 1. Start MongoDB (if running locally^)
echo    mongod
echo.
echo 2. Start Backend (from project root^)
echo    cd backend ^&^& npm run dev
echo.
echo 3. Start Frontend (from project root, in new terminal^)
echo    cd frontend ^&^& npm start
echo.
echo 4. Open browser:
echo    http://localhost:3000
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo ==========================================
echo.

pause

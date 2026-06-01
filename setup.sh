#!/bin/bash

# Quiz Management Portal - Quick Start Guide

echo "=========================================="
echo "  Quiz Management Portal - Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found in backend/"
    echo "Creating template .env file..."
    cat > .env << EOF
PORT=5001
MONGODB_URI=mongodb://localhost:27017/quiz-portal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
EOF
    echo "✅ Created .env file - Please update with your MongoDB URI"
else
    echo "✅ .env file already exists"
fi

cd ..
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found in frontend/"
    echo "Creating template .env file..."
    cat > .env << EOF
REACT_APP_API_URL=http://localhost:5001
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

cd ..
echo ""

echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start MongoDB (if running locally):"
echo "   mongod"
echo ""
echo "2. Start Backend (from project root):"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start Frontend (from project root, in new terminal):"
echo "   cd frontend && npm start"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "📚 For detailed instructions, see SETUP_GUIDE.md"
echo "=========================================="

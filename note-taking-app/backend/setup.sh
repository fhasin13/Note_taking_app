#!/bin/bash

# Setup Script for Note-Taking App Backend
# This script helps automate the setup process

echo "🚀 Note-Taking App Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Please install Node.js from: https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js is installed: $(node --version)"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
else
    echo "✅ npm is installed: $(npm --version)"
fi

# Check if .env file exists
echo ""
echo "📝 Checking configuration..."
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file"
        echo "⚠️  IMPORTANT: Please edit .env file and update:"
        echo "   - MONGODB_URI (your MongoDB connection string)"
        echo "   - JWT_SECRET (any random string)"
    else
        echo "❌ .env.example not found!"
        exit 1
    fi
else
    echo "✅ .env file exists"
fi

# Install dependencies
echo ""
echo "📦 Installing backend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your MongoDB connection string"
echo "2. Make sure MongoDB is running (or use MongoDB Atlas)"
echo "3. Run: npm start"
echo ""


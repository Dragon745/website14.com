#!/bin/bash

# Website14 Build and Deploy Script
# This script builds the Next.js app and prepares it for Firebase deployment

echo "🚀 Website14 Build and Deploy Script"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the website14app directory."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Install dependencies (if needed)
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️ Building the project..."
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Error: Build failed. 'out' directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Static files generated in 'out' directory"
echo ""
echo "📋 Next steps:"
echo "1. Commit the 'out' folder to git"
echo "2. Push to GitHub"
echo "3. GitHub Actions will deploy to Firebase Hosting"
echo ""
echo "Or run: npm run deploy (to deploy directly to Firebase)"
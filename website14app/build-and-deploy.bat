@echo off
echo 🚀 Website14 Build and Deploy Script
echo =====================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the website14app directory.
    exit /b 1
)

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"

REM Install dependencies (if needed)
echo 📦 Installing dependencies...
call npm install

REM Build the project
echo 🏗️ Building the project...
call npm run build

REM Check if build was successful
if not exist "out" (
    echo ❌ Error: Build failed. 'out' directory not found.
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📁 Static files generated in 'out' directory
echo.
echo 📋 Next steps:
echo 1. Commit the 'out' folder to git
echo 2. Push to GitHub
echo 3. GitHub Actions will deploy to Firebase Hosting
echo.
echo Or run: npm run deploy (to deploy directly to Firebase)
pause 
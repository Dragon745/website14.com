#!/bin/bash

echo "📁 Cleaning project directory..."
cd /root/website14.com/website14app || exit 1

echo "🧹 Removing node_modules and lock file..."
rm -rf node_modules package-lock.json

echo "🔍 Removing hidden leftover folders..."
find . -name "node_modules" -type d -exec rm -rf {} +
find . -name ".caniuse-lite*" -exec rm -rf {} +

echo "🧼 Cleaning npm cache..."
npm cache clean --force

echo "⚙️ Setting safe npm timeouts..."
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
npm config set timeout 120000

echo "📦 Installing npm dependencies..."
npm install --registry=https://registry.npmjs.org/ --fetch-timeout=60000

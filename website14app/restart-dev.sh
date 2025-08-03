#!/bin/bash

echo "Stopping development server..."
pkill -f "next dev" || true

echo "Clearing Next.js cache..."
rm -rf .next

echo "Clearing node_modules cache..."
rm -rf node_modules/.cache

echo "Reinstalling dependencies..."
npm install

echo "Starting development server..."
npm run dev
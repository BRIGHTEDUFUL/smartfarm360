#!/bin/bash

set -e

echo "Deploying Smart Farming 360 to Render..."

if [ ! -d .git ]; then
    echo "No git repository found."
    exit 1
fi

if ! git remote | grep -q origin; then
    echo "No git remote found."
    echo "Add your GitHub repository first:"
    echo "git remote add origin https://github.com/yourusername/smart-farming-360.git"
    exit 1
fi

echo "Checking Render deployment config..."
npm run deploy:check

echo "Running Render build locally..."
npm run build:render

echo "Pushing latest changes to GitHub..."
git add .
git commit -m "Prepare Render deployment"
git push origin main

echo
echo "Next steps:"
echo "1. Go to https://render.com"
echo "2. Click 'New +' -> 'Blueprint'"
echo "3. Connect your GitHub repository"
echo "4. Confirm these settings:"
echo "   - Build Command: npm run build:render"
echo "   - Start Command: npm run start:prod"
echo "   - Environment: Node"
echo "5. Confirm these environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - DB_PATH=/tmp/smart_farming.db"
echo "   - JWT_ACCESS_SECRET=<generate-strong-secret>"
echo "   - JWT_REFRESH_SECRET=<generate-strong-secret>"

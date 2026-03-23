#!/bin/bash

# Smart Farming 360 - Render Deployment Script

echo "🚀 Deploying Smart Farming 360 to Render..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
fi

# Check if remote exists
if ! git remote | grep -q origin; then
    echo "❌ No git remote found!"
    echo "Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/smart-farming-360.git"
    exit 1
fi

# Build locally to test
echo "🔨 Building locally to test..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy to Render - $(date)"
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Build Command: npm run build"
echo "   - Start Command: npm run start:prod"
echo "   - Environment: Node"
echo "5. Add environment variables:"
echo "   - NODE_ENV=production"
echo "   - JWT_ACCESS_SECRET=<generate-strong-secret>"
echo "   - JWT_REFRESH_SECRET=<generate-strong-secret>"
echo ""
echo "🎉 Your app will be live in 5-10 minutes!"

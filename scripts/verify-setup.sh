#!/bin/bash

# Firebase Deployment Verification Script
echo "🔍 Verifying Firebase Deployment Setup..."
echo ""

# Check if Firebase CLI is installed
if command -v firebase &> /dev/null; then
    echo "✅ Firebase CLI is installed"
    firebase --version
else
    echo "❌ Firebase CLI is NOT installed"
    echo "   Run: npm install -g firebase-tools"
fi
echo ""

# Check if firebase.json exists
if [ -f "firebase.json" ]; then
    echo "✅ firebase.json exists"
else
    echo "❌ firebase.json not found"
fi

# Check if .firebaserc exists
if [ -f ".firebaserc" ]; then
    echo "✅ .firebaserc exists"
else
    echo "❌ .firebaserc not found"
fi

# Check if GitHub workflow exists
if [ -f ".github/workflows/firebase-deploy.yml" ]; then
    echo "✅ GitHub workflow configured"
else
    echo "❌ GitHub workflow not found"
fi
echo ""

# Check for required files
echo "📁 Checking project files..."
if [ -f "next.config.ts" ]; then
    echo "✅ next.config.ts exists"
else
    echo "❌ next.config.ts not found"
fi

if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json not found"
fi
echo ""

# Check for .env file (should not be committed)
if [ -f ".env" ]; then
    echo "⚠️  .env file exists (DO NOT commit this file)"
else
    echo "✅ No .env file found (good for production)"
fi
echo ""

echo "📋 Next Steps:"
echo "1. Install Firebase CLI: npm install -g firebase-tools"
echo "2. Login to Firebase: firebase login"
echo "3. Set up GitHub Secrets (see DEPLOYMENT.md)"
echo "4. Push to main branch to trigger deployment"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"

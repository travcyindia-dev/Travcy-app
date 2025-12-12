#!/bin/bash

echo "🚀 Firebase Deployment - All in One"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Check Firebase CLI
echo "Step 1: Checking Firebase CLI..."
if command -v firebase &> /dev/null; then
    print_status 0 "Firebase CLI installed"
else
    print_status 1 "Firebase CLI not installed"
    echo -e "${YELLOW}Installing Firebase CLI...${NC}"
    npm install -g firebase-tools
fi
echo ""

# Login to Firebase
echo "Step 2: Firebase Login..."
firebase login --reauth
echo ""

# Build the project
echo "Step 3: Building Next.js project..."
npm run build
if [ $? -eq 0 ]; then
    print_status 0 "Build successful"
else
    print_status 1 "Build failed"
    exit 1
fi
echo ""

# Deploy to Firebase
echo "Step 4: Deploying to Firebase Hosting..."
firebase deploy --only hosting
if [ $? -eq 0 ]; then
    print_status 0 "Deployment successful!"
    echo ""
    echo -e "${GREEN}🎉 Your app is live!${NC}"
    echo "Visit: https://travcy-60292.web.app"
else
    print_status 1 "Deployment failed"
    exit 1
fi
echo ""

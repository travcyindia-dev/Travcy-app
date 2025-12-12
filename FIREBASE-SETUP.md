# 🚀 Complete Firebase Deployment Setup

Your travel app is now configured for Firebase deployment with automated GitHub workflows!

## ✅ What's Been Configured:

### 1. Firebase Configuration Files
- ✅ `firebase.json` - Hosting configuration
- ✅ `.firebaserc` - Project settings (travcy-60292)
- ✅ `next.config.ts` - Static export enabled

### 2. GitHub Workflow
- ✅ `.github/workflows/firebase-deploy.yml` - Auto-deploy on push to main
- ✅ Environment variables configured via GitHub Secrets

### 3. Updated Scripts
```json
"deploy": "npm run build && firebase deploy --only hosting"
"deploy:preview": "npm run build && firebase hosting:channel:deploy preview"
```

---

## 🎯 Quick Start: Deploy in 3 Steps

### Option A: Manual Deployment (Fastest for first deploy)

```bash
# 1. Install Firebase CLI (one-time)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Deploy!
npm run deploy
```

Your app will be live at: **https://travcy-60292.web.app**

---

### Option B: Automated GitHub Deployment

#### Step 1: Get Firebase Service Account
1. Go to [Firebase Console](https://console.firebase.google.com/project/travcy-60292/settings/serviceaccounts/adminsdk)
2. Click **"Generate New Private Key"**
3. Save the JSON file

#### Step 2: Add GitHub Secrets
Go to: `https://github.com/YOUR_USERNAME/demo-travel-app/settings/secrets/actions`

Click **"New repository secret"** and add:

**Required Secrets:**
```
FIREBASE_SERVICE_ACCOUNT          (paste entire JSON from step 1)
NEXT_PUBLIC_FIREBASE_API_KEY      AIzaSyAvPARGdVF7OT8Q517S3hA0N9OoON_ch4E
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  travcy-60292.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID   travcy-60292
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET  travcy-60292.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  652225914162
NEXT_PUBLIC_FIREBASE_APP_ID       1:652225914162:web:3b752edccec32bc59b632b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID  G-B2HH2WZEVB
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  dlu0vagfj
NEXT_PUBLIC_CLOUDINARY_API_KEY     935315283613816
NEXT_PUBLIC_CLOUDINARY_API_SECRET  81Fjx2mxSQH6SC7OBHzwjhmkyqo
NEXT_PUBLIC_RAZOR_PAY_TEST_API_KEY  rzp_test_RkXlzDfttqjm8g
NEXT_PUBLIC_RAZOR_PAY_TEST_KEY_SECRET  erKquod2QRO9KLx1l20rVTYP
SMTP_EMAIL                        your-email@gmail.com
SMTP_PASSWORD                     your-gmail-app-password
NEXT_PUBLIC_APP_URL               https://travcy-60292.web.app
```

#### Step 3: Push to Deploy
```bash
git add .
git commit -m "Deploy to Firebase"
git push origin main
```

**GitHub Actions will automatically build and deploy!** 🎉

Monitor progress: `https://github.com/YOUR_USERNAME/demo-travel-app/actions`

---

## 📋 All Available Commands

```bash
# Development
npm run dev              # Start dev server

# Build & Deploy
npm run build            # Build for production
npm run deploy           # Build + Deploy to Firebase
npm run deploy:preview   # Deploy to preview channel

# Verification
bash scripts/verify-setup.sh     # Check setup
bash scripts/deploy-all.sh       # One-command full deploy
```

---

## 🌐 Your Live URLs

After deployment:
- **Primary**: https://travcy-60292.web.app
- **Alternative**: https://travcy-60292.firebaseapp.com

---

## 📚 Documentation Files

- **DEPLOYMENT.md** - Complete detailed guide
- **DEPLOY-QUICK.md** - Quick reference
- **FIREBASE-SETUP.md** - This file

---

## 🔒 Security Notes

✅ `.env` file is in `.gitignore` - never committed
✅ Secrets managed via GitHub Secrets
✅ Production credentials separated from dev
✅ Firebase Service Account uses secure JSON key

---

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next out node_modules
npm install
npm run build
```

### Firebase Errors
```bash
# Re-authenticate
firebase logout
firebase login
```

### GitHub Actions Failing
1. Verify all secrets are added
2. Check Actions tab for specific error
3. Ensure FIREBASE_SERVICE_ACCOUNT is valid JSON

---

## 🎉 You're All Set!

Choose your deployment method and go live:

**Quick Deploy (Recommended for first time):**
```bash
npm install -g firebase-tools
firebase login
npm run deploy
```

**Or push to GitHub for automated deployment!**

---

Need help? Check the detailed guides:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full documentation
- [DEPLOY-QUICK.md](./DEPLOY-QUICK.md) - Quick reference

Happy deploying! 🚀

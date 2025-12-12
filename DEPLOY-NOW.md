# 🚀 Deploy Your Travel App - Simple Guide

## ✅ Build is Fixed!

Your app now builds successfully with all API routes working.

---

## 🎯 Quick Deploy Options

### Option 1: Vercel (Easiest - Recommended)

Vercel is made for Next.js and handles everything automatically:

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy (it will guide you through login)
vercel

# 3. For production deployment
vercel --prod
```

**That's it!** Vercel will:
- Build your app
- Deploy API routes as serverless functions
- Give you a live URL
- Set up automatic deployments from GitHub

**Add environment variables in Vercel Dashboard:**
- Go to project settings → Environment Variables
- Add all your `.env` variables

---

### Option 2: Firebase with Next.js Support

Firebase can host Next.js apps with experimental web frameworks:

```bash
# 1. Enable experimental features
firebase experiments:enable webframeworks

# 2. Initialize hosting (first time)
firebase init hosting
# Select: travcy-60292
# Framework: Next.js (auto-detected)

# 3. Deploy
firebase deploy
```

**Note**: Firebase will create Cloud Functions for your API routes automatically.

---

## 📋 Environment Variables Needed

Make sure to set these in your deployment platform:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAvPARGdVF7OT8Q517S3hA0N9OoON_ch4E
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=travcy-60292.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=travcy-60292
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=travcy-60292.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=652225914162
NEXT_PUBLIC_FIREBASE_APP_ID=1:652225914162:web:3b752edccec32bc59b632b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-B2HH2WZEVB
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dlu0vagfj
NEXT_PUBLIC_CLOUDINARY_API_KEY=935315283613816
NEXT_PUBLIC_CLOUDINARY_API_SECRET=81Fjx2mxSQH6SC7OBHzwjhmkyqo
NEXT_PUBLIC_RAZOR_PAY_TEST_API_KEY=rzp_test_RkXlzDfttqjm8g
NEXT_PUBLIC_RAZOR_PAY_TEST_KEY_SECRET=erKquod2QRO9KLx1l20rVTYP
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NEXT_PUBLIC_APP_URL=https://your-app-url.com
```

---

## ⚡ My Recommendation

**Use Vercel** - it's the easiest and most reliable for Next.js apps with API routes:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables
6. Click "Deploy"

**Done!** Your app will be live with automatic deployments on every push.

---

## 🔍 Verify Build Locally

Before deploying, verify everything works:

```bash
# Build
npm run build

# Test production build locally
npm start

# Visit http://localhost:3000
```

All routes should work including:
- Customer dashboard
- Agency portal
- Admin panel
- All API endpoints

---

## 📝 What Changed

✅ Removed `output: 'export'` from next.config.ts
✅ API routes now work (they require server-side support)
✅ Build completes successfully
✅ Ready for Vercel or Firebase deployment

See [BUILD-FIX.md](./BUILD-FIX.md) for technical details.

---

**Questions?**
- Vercel docs: https://vercel.com/docs
- Firebase Next.js: https://firebase.google.com/docs/hosting/frameworks/nextjs

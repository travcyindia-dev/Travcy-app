# Deployment Quick Reference

## 🚀 One-Command Deploy

### First Time Setup:
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### Deploy Now:
```bash
# Build and deploy in one go
npm run build && firebase deploy --only hosting
```

## 📦 What's Configured:

✅ **firebase.json** - Hosting configuration for static files
✅ **next.config.ts** - Static export enabled for Firebase
✅ **GitHub Workflow** - Auto-deploy on push to main
✅ **.firebaserc** - Project ID: travcy-60292

## 🔑 GitHub Secrets Checklist:

Before pushing to GitHub, add these secrets in:
**Settings → Secrets and variables → Actions**

- [ ] FIREBASE_SERVICE_ACCOUNT
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- [ ] NEXT_PUBLIC_CLOUDINARY_API_KEY
- [ ] NEXT_PUBLIC_CLOUDINARY_API_SECRET
- [ ] NEXT_PUBLIC_RAZOR_PAY_TEST_API_KEY
- [ ] NEXT_PUBLIC_RAZOR_PAY_TEST_KEY_SECRET
- [ ] SMTP_EMAIL
- [ ] SMTP_PASSWORD
- [ ] NEXT_PUBLIC_APP_URL

## 🌐 Your URLs After Deployment:

- https://travcy-60292.web.app
- https://travcy-60292.firebaseapp.com

## 🔄 Auto Deploy Workflow:

```bash
git add .
git commit -m "Your commit message"
git push origin main
# GitHub Actions will automatically deploy!
```

## 🛠️ Manual Deploy:

```bash
npm run build
firebase deploy --only hosting
```

## 📊 Monitor Deployment:

- GitHub: https://github.com/YOUR_USERNAME/demo-travel-app/actions
- Firebase Console: https://console.firebase.google.com/project/travcy-60292/hosting

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

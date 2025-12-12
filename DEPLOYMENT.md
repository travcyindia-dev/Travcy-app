# Firebase Deployment Setup Guide

## 🚀 Quick Deployment Setup

### 1. Install Firebase Tools (One-time setup)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase (Already configured)
The project is already configured with:
- `firebase.json` - Firebase hosting configuration
- `.firebaserc` - Project configuration (travcy-60292)
- GitHub workflow for automated deployment

### 4. Manual Deployment (Optional)
To deploy manually from your local machine:
```bash
npm run build
firebase deploy --only hosting
```

---

## 🔐 GitHub Secrets Setup

### Required GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

#### Firebase Credentials
1. **FIREBASE_SERVICE_ACCOUNT**
   - Get this from Firebase Console:
     - Go to Project Settings → Service Accounts
     - Click "Generate new private key"
     - Copy the entire JSON content and paste as secret value

#### Production Environment Variables
2. **NEXT_PUBLIC_FIREBASE_API_KEY**: `AIzaSyAvPARGdVF7OT8Q517S3hA0N9OoON_ch4E`
3. **NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN**: `travcy-60292.firebaseapp.com`
4. **NEXT_PUBLIC_FIREBASE_PROJECT_ID**: `travcy-60292`
5. **NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET**: `travcy-60292.firebasestorage.app`
6. **NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID**: `652225914162`
7. **NEXT_PUBLIC_FIREBASE_APP_ID**: `1:652225914162:web:3b752edccec32bc59b632b`
8. **NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID**: `G-B2HH2WZEVB`

#### Cloudinary Credentials
9. **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME**: `dlu0vagfj`
10. **NEXT_PUBLIC_CLOUDINARY_API_KEY**: `935315283613816`
11. **NEXT_PUBLIC_CLOUDINARY_API_SECRET**: `81Fjx2mxSQH6SC7OBHzwjhmkyqo`

#### Razorpay Credentials
12. **NEXT_PUBLIC_RAZOR_PAY_TEST_API_KEY**: `rzp_test_RkXlzDfttqjm8g`
13. **NEXT_PUBLIC_RAZOR_PAY_TEST_KEY_SECRET**: `erKquod2QRO9KLx1l20rVTYP`

#### Email Configuration
14. **SMTP_EMAIL**: Your Gmail address
15. **SMTP_PASSWORD**: Your Gmail App Password (https://support.google.com/accounts/answer/185833)

#### App URL
16. **NEXT_PUBLIC_APP_URL**: `https://travcy-60292.web.app` (or your custom domain)

---

## 📋 Step-by-Step GitHub Secrets Setup

### Getting Firebase Service Account:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **travcy-60292**
3. Click the gear icon ⚙️ → Project Settings
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Copy the entire JSON content
7. In GitHub: Settings → Secrets → New repository secret
8. Name: `FIREBASE_SERVICE_ACCOUNT`
9. Value: Paste the entire JSON

### Adding Other Secrets:
For each environment variable listed above:
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Enter the name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
4. Enter the value
5. Click "Add secret"

---

## 🔄 Automated Deployment Flow

Once GitHub secrets are configured:

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to Firebase"
   git push origin main
   ```

2. **GitHub Actions will automatically**:
   - Install dependencies
   - Create .env file with secrets
   - Build the Next.js app
   - Deploy to Firebase Hosting

3. **Monitor deployment**:
   - Go to GitHub → Actions tab
   - Watch the deployment progress
   - Get the deployment URL from Firebase

---

## 🌐 Accessing Your Deployed App

After successful deployment, your app will be available at:
- **Firebase URL**: https://travcy-60292.web.app
- **Firebase URL (Alt)**: https://travcy-60292.firebaseapp.com

To add a custom domain:
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps

---

## 🔧 Troubleshooting

### Build fails in GitHub Actions:
- Verify all secrets are added correctly
- Check the Actions tab for error messages
- Ensure Firebase Service Account JSON is valid

### Environment variables not working:
- Ensure all NEXT_PUBLIC_ prefixed variables are set
- Check that secrets match exactly (no extra spaces)
- Rebuild the app after adding new secrets

### Firebase deployment fails:
- Verify Firebase Service Account has Hosting Admin role
- Check Firebase project ID matches: travcy-60292
- Ensure Firebase Hosting is enabled in your project

---

## 📝 Notes

- The workflow triggers on every push to `main` branch
- You can also trigger manually from GitHub Actions tab
- Environment variables are securely stored in GitHub Secrets
- Never commit the `.env` file to the repository
- The app uses static export mode for Firebase Hosting compatibility

---

## 🎯 Quick Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Deploy manually to Firebase
firebase deploy --only hosting

# View Firebase logs
firebase hosting:channel:list
```

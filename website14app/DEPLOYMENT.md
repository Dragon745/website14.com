# 🚀 Website14 Deployment Guide

## Overview

This guide covers the complete deployment setup for Website14, including local builds and automated Firebase hosting deployment.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Firebase CLI** installed globally
3. **Git** configured
4. **Firebase project** set up

## 🔧 Initial Setup

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase (if not already done)

```bash
firebase init hosting
```

**Settings:**

- Public directory: `out`
- Configure as single-page app: `No`
- Set up automatic builds: `No`
- Overwrite index.html: `Yes`

## 🏗️ Build Configuration

### Next.js Config (`next.config.mjs`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // Static export
  trailingSlash: true, // Required for hosting
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build
  },
};

export default nextConfig;
```

### Firebase Config (`firebase.json`)

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 📦 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Deployment

```bash
npm run deploy       # Build + Deploy to Firebase
npm run deploy:live  # Build + Deploy to live channel
npm run deploy:preview # Build + Deploy to preview channel
npm run build:local  # Build locally for GitHub deployment
```

### Maintenance

```bash
npm run clean        # Clean build artifacts
npm run rebuild      # Clean + rebuild
```

## 🚀 Deployment Workflow

### Option 1: GitHub Actions (Recommended)

1. **Build locally:**

   ```bash
   cd website14app
   npm run build:local
   ```

2. **Commit and push:**

   ```bash
   git add out/
   git commit -m "Build for deployment"
   git push origin main
   ```

3. **GitHub Actions will automatically deploy to Firebase Hosting**

### Option 2: Direct Firebase Deployment

1. **Build and deploy:**
   ```bash
   cd website14app
   npm run deploy
   ```

### Option 3: Windows Batch File

1. **Run the build script:**

   ```bash
   cd website14app
   build-and-deploy.bat
   ```

2. **Follow the prompts to commit and push**

## 🔄 GitHub Actions Configuration

The project uses two GitHub Actions workflows:

1. **firebase-hosting-merge.yml** - Deploys on merge to main branch
2. **firebase-hosting-pull-request.yml** - Deploys preview for pull requests

Both workflows:

- Use pre-built `out` folder (no build step in CI)
- Deploy to Firebase Hosting
- Use Firebase service account for authentication

## 🛠️ Troubleshooting

### Build Issues

1. **Clean and rebuild:**

   ```bash
   npm run clean
   npm run build
   ```

2. **Check Next.js version compatibility:**

   ```bash
   npm list next
   ```

3. **Verify configuration:**
   - Check `next.config.mjs` has `output: 'export'`
   - Ensure `trailingSlash: true`
   - Verify `images.unoptimized: true`

### Deployment Issues

1. **Check Firebase configuration:**

   ```bash
   firebase projects:list
   firebase use website14
   ```

2. **Verify service account:**

   - Check GitHub repository secrets
   - Ensure `FIREBASE_SERVICE_ACCOUNT_WEBSITE14_FB82E` is set

3. **Test local deployment:**
   ```bash
   firebase serve
   ```

### Common Errors

1. **"npx failed with exit code 2"**

   - This happens when GitHub Actions tries to build
   - Solution: Use pre-built `out` folder (already configured)

2. **"out directory not found"**

   - Run `npm run build` locally first
   - Commit the `out` folder to git

3. **"Firebase service account not found"**
   - Check GitHub repository secrets
   - Verify the service account JSON is correct

## 📁 Project Structure

```
website14app/
├── src/                 # Source code
├── public/              # Static assets
├── out/                 # Built static files (committed to git)
├── .next/               # Next.js build cache (ignored)
├── firebase.json        # Firebase configuration
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies and scripts
└── build-and-deploy.bat # Windows build script
```

## 🔐 Security Notes

- Firebase service account is stored as GitHub secret
- No sensitive data in the `out` folder
- All authentication handled by Firebase Auth
- HTTPS enforced by Firebase Hosting

## 📊 Monitoring

- **Firebase Console**: View hosting analytics
- **GitHub Actions**: Monitor deployment status
- **Firebase CLI**: Check deployment logs

```bash
firebase hosting:channel:list
firebase hosting:releases:list
```

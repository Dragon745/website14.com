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
```

### Maintenance

```bash
npm run clean        # Clean build files
npm run rebuild      # Clean + Rebuild
```

## 🚀 Deployment Workflow

### Option 1: Local Build + Manual Deploy

1. **Build locally:**

```bash
npm run build
```

2. **Deploy to Firebase:**

```bash
firebase deploy
```

### Option 2: Automated GitHub Actions

1. **Push to GitHub:**

```bash
git add .
git commit -m "Update website"
git push origin main
```

2. **GitHub Actions will automatically:**
   - Build the project
   - Deploy to Firebase Hosting

## 🔄 Automated Deployment Setup

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

The workflow automatically:

- ✅ Triggers on push to `main` branch
- ✅ Sets up Node.js environment
- ✅ Installs dependencies
- ✅ Builds the project
- ✅ Deploys to Firebase Hosting

### Required GitHub Secrets

Add these secrets in your GitHub repository settings:

1. **FIREBASE_SERVICE_ACCOUNT_WEBSITE14_FB82E**
   - Generate from Firebase Console
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Copy the JSON content to GitHub secret

## 🌐 Deployment URLs

After deployment, your site will be available at:

- **Production**: `https://website14-fb82e.web.app`
- **Alternative**: `https://website14-fb82e.firebaseapp.com`

## 📊 Monitoring

### Firebase Console

- Visit: https://console.firebase.google.com/project/website14-fb82e
- Monitor hosting performance
- View analytics
- Check error logs

### GitHub Actions

- Visit: https://github.com/[username]/website14app/actions
- Monitor deployment status
- View build logs

## 🔧 Troubleshooting

### Build Issues

```bash
# Clean and rebuild
npm run clean
npm run build

# Check for errors
npm run lint
```

### Deployment Issues

```bash
# Check Firebase status
firebase projects:list
firebase hosting:sites:list

# Redeploy
firebase deploy --force
```

### Common Issues

1. **Build fails with ESLint errors**

   - ESLint is disabled in build config
   - Fix issues locally with `npm run lint`

2. **Firebase deploy fails**

   - Check Firebase CLI is logged in: `firebase login`
   - Verify project ID: `firebase use website14-fb82e`

3. **GitHub Actions fails**
   - Check Firebase service account secret
   - Verify repository permissions

## 🎯 Best Practices

### Before Deploying

1. ✅ Test locally: `npm run dev`
2. ✅ Build locally: `npm run build`
3. ✅ Check for errors: `npm run lint`
4. ✅ Commit all changes

### Deployment Checklist

- [ ] All features working locally
- [ ] Build completes successfully
- [ ] No console errors
- [ ] All pages accessible
- [ ] Authentication working
- [ ] Contact form functional
- [ ] Preloading working

## 📈 Performance Optimization

### Build Optimization

- Static export for fast loading
- Image optimization disabled for static hosting
- Preloading implemented for instant navigation

### Firebase Hosting Features

- Global CDN
- Automatic HTTPS
- Custom domain support
- Analytics integration

## 🔐 Security

### Environment Variables

- Firebase config is public (safe for client-side)
- No sensitive data in code
- Authentication handled by Firebase Auth

### Security Headers

- CORS configured
- Cache headers optimized
- HTTPS enforced

## 📞 Support

For deployment issues:

1. Check Firebase Console logs
2. Review GitHub Actions logs
3. Test locally first
4. Verify Firebase project settings

---

**Last Updated**: January 2025
**Version**: 1.0.0

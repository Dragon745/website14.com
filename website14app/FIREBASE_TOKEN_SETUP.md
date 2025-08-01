# 🔑 Firebase Token Setup for GitHub Actions

## Overview

This guide explains how to generate a Firebase token for automated deployment via GitHub Actions.

## 🔧 Generate Firebase Token

### Step 1: Login to Firebase CLI

```bash
firebase login
```

### Step 2: Generate CI Token

```bash
firebase login:ci
```

This command will:
1. Open a browser window
2. Ask you to authorize the Firebase CLI
3. Generate a token for CI/CD use

### Step 3: Copy the Token

The command will output something like:
```
✔  Success! Use this token to login on a CI server:

1//0eXAMPLE_TOKEN_HERE

Example: firebase deploy --token "$FIREBASE_TOKEN"
```

## 🔐 Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_TOKEN`
5. Value: Paste the token from Step 3

## ✅ Verify Setup

The token should look like: `1//0eXAMPLE_TOKEN_HERE`

## 🚀 Test Deployment

After adding the token, push to main branch and check:
- GitHub Actions tab for deployment status
- Firebase Console for new deployment

## 🔄 Alternative: Service Account (Current Method)

If you prefer to use the service account method:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Add as `FIREBASE_SERVICE_ACCOUNT_WEBSITE14_FB82E` secret
4. Use the original workflow configuration

## 🛠️ Troubleshooting

### Token Expired
```bash
firebase login:ci
```

### Permission Denied
- Ensure the token has proper permissions
- Check Firebase project settings

### Invalid Token
- Regenerate the token
- Update GitHub secret
- Clear GitHub Actions cache 
# 🚀 Netlify Deployment Guide for TripBuddy

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Your TripBuddy app pushed to GitHub
- ✅ A Netlify account (free)
- ✅ Your Convex deployment URL

## 🎯 Step-by-Step Deployment Process

### Step 1: Sign Up/Login to Netlify

1. **Go to Netlify**: Visit [netlify.com](https://netlify.com)
2. **Sign Up**: Click "Sign up" (if you don't have an account)
   - You can sign up with GitHub, GitLab, Bitbucket, or email
3. **Login**: If you already have an account, click "Log in"

### Step 2: Connect Your GitHub Repository

1. **From Netlify Dashboard**:
   - Click **"New site from Git"**
   - Choose **"GitHub"** as your Git provider
   - Authorize Netlify to access your GitHub account

2. **Select Your Repository**:
   - Search for `Vedang22MIC0017/TripItinerary`
   - Click on your repository to select it

### Step 3: Configure Build Settings

1. **Build Command**: Enter `npm run build`
2. **Publish Directory**: Enter `build`
3. **Base Directory**: Leave empty (unless your React app is in a subdirectory)

Your settings should look like this:
```
Build command: npm run build
Publish directory: build
Base directory: (leave empty)
```

### Step 4: Set Environment Variables

**Before clicking "Deploy site"**, you need to add environment variables:

1. **Click "Show advanced"** to expand the advanced options
2. **Click "New variable"** to add each environment variable:

#### Required Environment Variables:

```env
REACT_APP_CONVEX_URL=https://hushed-capybara-128.convex.cloud
```

**To get your Convex URL:**
1. Check your `.env.local` file in your project
2. Or run `npx convex dev` and copy the URL from the output
3. Or check your Convex dashboard at [dashboard.convex.dev](https://dashboard.convex.dev)

#### Optional Environment Variables (for Google Drive):

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_API_KEY=your_google_api_key
```

### Step 5: Deploy Your Site

1. **Click "Deploy site"**
2. **Wait for build**: Netlify will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build your React app (`npm run build`)
   - Deploy to their CDN

3. **Build Status**: You'll see a progress indicator
   - Green checkmark = Success
   - Red X = Error (check build logs)

### Step 6: Access Your Live Site

1. **Default URL**: Netlify will give you a random URL like:
   ```
   https://amazing-name-123456.netlify.app
   ```

2. **Custom Domain** (Optional):
   - Go to **Site settings** > **Domain management**
   - Click **"Add custom domain"**
   - Follow the instructions to set up your domain

## 🔧 Troubleshooting Common Issues

### Issue 1: Build Fails with "Module not found"

**Solution**: Check your `package.json` and ensure all dependencies are listed.

### Issue 2: Environment Variables Not Working

**Solution**: 
1. Go to **Site settings** > **Environment variables**
2. Add your variables again
3. Redeploy the site

### Issue 3: Convex Connection Error

**Solution**:
1. Verify your `REACT_APP_CONVEX_URL` is correct
2. Ensure your Convex deployment is running
3. Check the Convex dashboard for any errors

### Issue 4: 404 Errors on Refresh

**Solution**: This is normal for React Router. Netlify handles this automatically with the `build` folder.

## 📱 Post-Deployment Steps

### Step 7: Test Your Application

1. **Visit your Netlify URL**
2. **Test all features**:
   - ✅ Home page loads
   - ✅ Navigation works
   - ✅ Memories upload works
   - ✅ Schedule creation works
   - ✅ Expense tracking works
   - ✅ Personal Drive works

### Step 8: Set Up Custom Domain (Optional)

1. **Go to Site settings** > **Domain management**
2. **Add custom domain**: Enter your domain
3. **Configure DNS**: Follow Netlify's DNS instructions
4. **Wait for propagation**: Can take up to 24 hours

### Step 9: Enable HTTPS

Netlify automatically provides SSL certificates for all sites.

## 🔄 Continuous Deployment

### Automatic Deployments

Netlify will automatically:
- ✅ Deploy when you push to `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Rollback to previous versions if needed

### Manual Deployments

To manually trigger a deployment:
1. Go to your site dashboard
2. Click **"Trigger deploy"** > **"Deploy site"**

## 📊 Monitoring Your Site

### Build Logs

1. **Go to your site dashboard**
2. **Click on any deployment**
3. **View build logs** for debugging

### Analytics

1. **Go to Site settings** > **Analytics**
2. **Enable analytics** to track visitors

## 🎯 Deployment Checklist

Before deploying, ensure:

- ✅ [ ] Repository is pushed to GitHub
- ✅ [ ] All dependencies are in `package.json`
- ✅ [ ] Environment variables are ready
- ✅ [ ] Convex deployment is running
- ✅ [ ] Build command is `npm run build`
- ✅ [ ] Publish directory is `build`

## 🚀 Quick Deploy Button

You can also deploy directly using this button:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Vedang22MIC0017/TripItinerary)

## 📞 Support

If you encounter issues:

1. **Check Netlify docs**: [docs.netlify.com](https://docs.netlify.com)
2. **Check build logs** in your Netlify dashboard
3. **Verify environment variables** are set correctly
4. **Ensure Convex is running** and accessible

## 🎉 Success!

Once deployed, your TripBuddy app will be live at your Netlify URL and ready for your Wayanad trip! 🏔️✨

---

**Your app will be accessible at**: `https://your-site-name.netlify.app`

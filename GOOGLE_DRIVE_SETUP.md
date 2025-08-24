# 🔗 Google Drive Integration Setup Guide

## 📋 Overview

Currently, the Memories feature stores images as base64 data in the Convex database. To use actual Google Drive storage (recommended for large files), follow this setup guide.

## 🚀 Quick Setup (Recommended)

### Option 1: Use Base64 Storage (Current - No Setup Required)
- ✅ **Works immediately** - no Google Drive setup needed
- ✅ **Images stored in database** - accessible offline
- ✅ **No API keys required**
- ⚠️ **Limited by database size** - not ideal for many large images

### Option 2: Google Drive API Integration (Advanced)

## 🔧 Google Drive API Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Drive API**

### Step 2: Create Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized origins:
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)
5. Download the JSON credentials file

### Step 3: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
REACT_APP_GOOGLE_API_KEY=your_api_key_here
```

### Step 4: Install Google Drive SDK

```bash
npm install @google-cloud/storage googleapis
```

### Step 5: Update the Code

Replace the `uploadToGoogleDrive` function in `src/pages/Memories.js`:

```javascript
import { gapi } from 'gapi-script';

// Initialize Google API
const initializeGoogleAPI = () => {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.file'
    });
  });
};

// Upload to Google Drive (real implementation)
const uploadToGoogleDrive = async (file) => {
  try {
    // Ensure user is authenticated
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      await gapi.auth2.getAuthInstance().signIn();
    }

    // Create file metadata
    const metadata = {
      name: file.name,
      parents: ['YOUR_FOLDER_ID_HERE'] // Replace with your folder ID
    };

    // Upload file
    const response = await gapi.client.drive.files.create({
      resource: metadata,
      media: {
        mimeType: file.type,
        body: file
      }
    });

    return `https://drive.google.com/file/d/${response.result.id}/view`;
  } catch (error) {
    console.error('Google Drive upload error:', error);
    return null; // Fallback to base64
  }
};
```

## 📁 Getting Your Google Drive Folder ID

1. **Create a folder** in Google Drive for your trip photos
2. **Open the folder** in your browser
3. **Copy the folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```
4. **Replace** `YOUR_FOLDER_ID_HERE` in the code with your actual folder ID

## 🔄 Alternative: Simple Folder Link

If you don't want to set up the full API, you can:

1. **Create a shared folder** in Google Drive
2. **Set permissions** to "Anyone with the link can view"
3. **Use the folder link** as a fallback

Update the `uploadToGoogleDrive` function:

```javascript
const uploadToGoogleDrive = async (file) => {
  // Simple fallback - just return your folder link
  const YOUR_DRIVE_FOLDER = 'https://drive.google.com/drive/folders/YOUR_FOLDER_ID';
  
  // For now, store as base64 and provide folder link
  return YOUR_DRIVE_FOLDER;
};
```

## 🎯 Current Implementation

The app currently works with **base64 storage** which means:

- ✅ **No setup required**
- ✅ **Images work immediately**
- ✅ **No external dependencies**
- ⚠️ **Limited by database size**

## 🚀 Recommended Approach

### For Quick Deployment:
1. **Keep current base64 storage** - works immediately
2. **Add your Google Drive folder link** for manual uploads
3. **Deploy and test**

### For Production:
1. **Set up Google Drive API** (follow steps above)
2. **Implement real file uploads**
3. **Add proper error handling**

## 📝 Environment Variables

Add these to your deployment platform (Vercel/Netlify):

```env
REACT_APP_GOOGLE_CLIENT_ID=your_client_id
REACT_APP_GOOGLE_API_KEY=your_api_key
REACT_APP_CONVEX_URL=your_convex_url
```

## 🔍 Troubleshooting

### "File does not exist" Error
- This happens because the current implementation uses fake URLs
- **Solution**: Use base64 storage (current) or set up real Google Drive API

### Permission Errors
- Ensure your Google Drive folder has proper sharing settings
- Check that your API credentials are correct

### File Size Limits
- Base64 storage: Limited by Convex database size
- Google Drive: 15GB free storage per account

## 📊 Storage Comparison

| Method | Setup | Storage | Cost | Reliability |
|--------|-------|---------|------|-------------|
| Base64 | None | Database | Free | High |
| Google Drive API | Complex | 15GB free | Free | High |
| Google Drive Manual | Simple | 15GB free | Free | Medium |

## 🎉 Ready to Deploy!

Your app works perfectly with the current base64 storage. For Google Drive integration, follow the steps above when you're ready for advanced features.

**Current Status**: ✅ **Ready for deployment with base64 storage**

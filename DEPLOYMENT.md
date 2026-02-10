# 🚀 Complete Deployment Guide

This guide will help you update all platforms: GitHub, Desktop App, Mobile App, and Server.

---

## 📋 Quick Summary

**What we updated:**
- ✅ Server now uses **session-only messages** (no database storage)
- ✅ Messages clear when you refresh/close the app
- ✅ Desktop and Mobile apps remain the same (UI only)

---

## 1️⃣ Push to GitHub

### **First Time Setup:**

1. **Create a GitHub repository:**
   - Go to: https://github.com/new
   - Repository name: `notepad-messenger`
   - Set to Public or Private
   - Click "Create repository"

2. **Connect your local project to GitHub:**
   ```powershell
   cd d:\Rohinth\rohinth\chat
   git remote add origin https://github.com/YOUR_USERNAME/notepad-messenger.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

### **Future Updates:**

Whenever you make changes:
```powershell
cd d:\Rohinth\rohinth\chat
git add .
git commit -m "Your update description"
git push origin main
```

---

## 2️⃣ Update Server (Render/Heroku)

Your server is deployed at: `https://sample-template-bxgm.onrender.com`

### **Option A: Automatic Deployment (Recommended)**

1. **Connect Render to GitHub:**
   - Log in to: https://dashboard.render.com
   - Go to your service: `sample-template-bxgm`
   - Settings → GitHub → Connect Repository
   - Select your `notepad-messenger` repo

2. **Enable Auto-Deploy:**
   - Settings → Auto-Deploy: ON
   - Branch: `main`
   - Now every time you push to GitHub, Render will auto-deploy! 🎉

### **Option B: Manual Deployment**

1. **Upload files to Render:**
   - Go to: https://dashboard.render.com
   - Select your service
   - Click "Manual Deploy" → "Deploy latest commit"

2. **Or redeploy from dashboard:**
   - Dashboard → Your Service → "Manual Deploy"

### **Verify Server is Updated:**

Visit: https://sample-template-bxgm.onrender.com/health

You should see:
```json
{
  "status": "OK",
  "uptime": 123.45,
  "mongodb": "Connected"
}
```

---

## 3️⃣ Update Desktop App (Electron)

The desktop app connects to your server, so it will automatically use the new session-only messages!

### **To Test Locally:**

```powershell
cd d:\Rohinth\rohinth\chat\app
npm start
```

### **To Build a New Desktop Installer (.exe):**

```powershell
cd d:\Rohinth\rohinth\chat\app
npm run build
```

The installer will be at: `app/release/Notepad Messenger Setup.exe`

**Share this file** with users to install/update the desktop app.

---

## 4️⃣ Update Mobile App (Android)

The mobile app also connects to your server, so it will use the new session-only messages automatically!

### **To Build a New APK:**

1. **Sync changes:**
   ```powershell
   cd d:\Rohinth\rohinth\chat\mobile
   npx cap sync android
   ```

2. **Open in Android Studio:**
   ```powershell
   npx cap open android
   ```

3. **Build APK:**
   - In Android Studio: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Wait 2-5 minutes
   - APK location: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

4. **Install on Phone:**
   - Transfer `app-debug.apk` to your Android phone
   - Install it (enable "Install from Unknown Sources" if needed)

---

## 🔄 Complete Update Workflow

Whenever you make changes to the project:

```powershell
# 1. Commit changes to Git
cd d:\Rohinth\rohinth\chat
git add .
git commit -m "Describe your changes"
git push origin main

# 2. Server updates automatically (if auto-deploy enabled)
# OR manually redeploy on Render dashboard

# 3. Desktop: Rebuild if needed
cd app
npm run build

# 4. Mobile: Rebuild if needed
cd mobile
npx cap sync android
npx cap open android
# Then build APK in Android Studio
```

---

## 🎯 What Each Platform Does:

| Platform | What it does | How to update |
|----------|-------------|---------------|
| **Server** | Handles messages, Socket.IO | Push to GitHub → Auto-deploy on Render |
| **Desktop** | Electron app for Windows | Rebuild with `npm run build` |
| **Mobile** | Android app (Capacitor) | Sync + Build APK in Android Studio |
| **GitHub** | Version control | `git push origin main` |

---

## ✅ Testing Checklist

After updating everything:

- [ ] Server is running: https://sample-template-bxgm.onrender.com/health
- [ ] Desktop app connects and sends messages
- [ ] Mobile app connects and sends messages  
- [ ] Messages clear when you refresh (session-only working!)
- [ ] Multiple users can chat in real-time

---

## 📞 Quick Reference Commands

```powershell
# Check if server is running locally
cd d:\Rohinth\rohinth\chat\server
node server.js

# Run desktop app
cd d:\Rohinth\rohinth\chat\app
npm start

# Sync mobile app
cd d:\Rohinth\rohinth\chat\mobile
npx cap sync android

# Git push
git add .
git commit -m "Update message"
git push origin main
```

---

## 🔧 Important URLs

- **Server**: https://sample-template-bxgm.onrender.com
- **GitHub**: (Your repo URL after creating it)
- **Render Dashboard**: https://dashboard.render.com

---

**Need help?** Check the main README.md or ask! 🚀

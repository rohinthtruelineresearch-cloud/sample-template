# 🔗 Complete Project Connection Map

## 📊 Overview

This document maps all GitHub repositories, Render deployments, and project connections for the Notepad Messenger project.

---

## 1️⃣ GitHub Account & Repositories

### **GitHub Account:**
```
rohinthtruelineresearch-cloud
```

### **Repository:**
```
https://github.com/rohinthtruelineresearch-cloud/sample-template.git
```

**Repository Structure:**
```
sample-template/
├── server/         ← Backend Node.js server (Socket.IO + MongoDB)
├── app/            ← Desktop Electron app (future)
├── mobile/         ← Android Capacitor app (future)
└── (other files)
```

---

## 2️⃣ Render Deployment

### **Render Service:**
- **Service Name**: `sample-template-bxgm`
- **Live URL**: `https://sample-template-bxgm.onrender.com`
- **Type**: Web Service
- **Connected Repository**: `rohinthtruelineresearch-cloud/sample-template`
- **Deploy Branch**: `main`
- **Root Directory**: `server/` (backend folder)

### **Render Dashboard:**
```
https://dashboard.render.com
```

### **Health Check Endpoint:**
```
https://sample-template-bxgm.onrender.com/health
```

---

## 3️⃣ Backend Server

### **Location:**
```
d:\Rohinth\rohinth\chat\server\
```

### **Git Remote:**
```
origin: https://github.com/rohinthtruelineresearch-cloud/sample-template.git
```

### **Deployment Flow:**
```
Local Changes (d:\...\chat\server\)
    ↓ (git push)
GitHub (rohinthtruelineresearch-cloud/sample-template)
    ↓ (auto-deploy)
Render (sample-template-bxgm.onrender.com)
```

### **Technologies:**
- Node.js + Express
- Socket.IO (real-time messaging)
- MongoDB Atlas (database)
- node-cron (scheduled tasks)

---

## 4️⃣ Desktop App (Electron)

### **Location:**
```
d:\Rohinth\rohinth\chat\app\
```

### **Backend Connection:**
```javascript
const socket = io("https://sample-template-bxgm.onrender.com");
```

### **Build Output:**
```
d:\Rohinth\rohinth\chat\app\release\NotepadMessenger Setup 1.0.0.exe
```

### **Distribution:**
- Standalone .exe installer
- No GitHub/render connection (runs locally)
- Connects to Render backend for messaging

---

## 5️⃣ Mobile App (Android)

### **Location:**
```
d:\Rohinth\rohinth\chat\mobile\
```

### **Backend Connection:**
```javascript
const socket = io("https://sample-template-bxgm.onrender.com");
```

### **Build Output:**
```
d:\Rohinth\rohinth\chat\mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

### **Platforms:**
- Android (Capacitor)
- WhatsApp-style UI

---

## 6️⃣ Database

### **MongoDB Atlas:**
- **Cluster**: Cluster0
- **Database**: `notepad_messenger`
- **Connection**: Via Render environment variables
- **Collections**:
  - `chats` - Message history
  - `users` - User profiles (new)

---

## 🔄 Complete Connection Flow

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Repository                      │
│   rohinthtruelineresearch-cloud/sample-template         │
│                                                          │
│   └── server/   → Deployed to Render                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    Render Service                        │
│   Name: sample-template-bxgm                            │
│   URL: https://sample-template-bxgm.onrender.com        │
│   Auto-deploys from: main branch (server/ folder)      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                 MongoDB Atlas Database                   │
│   Database: notepad_messenger                           │
│   Collections: chats, users                             │
└─────────────────────────────────────────────────────────┘
                        ↑
                ┌───────┴───────┐
                ↓               ↓
┌───────────────────────┐  ┌─────────────────────┐
│    Desktop App        │  │    Mobile App       │
│  (Electron - Win)     │  │  (Capacitor - And)  │
│                       │  │                     │
│  Connects to:         │  │  Connects to:       │
│  sample-template-     │  │  sample-template-   │
│  bxgm.onrender.com   │  │  bxgm.onrender.com  │
└───────────────────────┘  └─────────────────────┘
```

---

## 📋 Quick Reference

### **To Deploy Backend Updates:**
```powershell
cd d:\Rohinth\rohinth\chat\server
git add .
git commit -m "Update message"
git push origin main
# Render auto-deploys in 2-3 minutes
```

### **To Build Desktop App:**
```powershell
cd d:\Rohinth\rohinth\chat\app
npm run dist
# Output: app/release/NotepadMessenger Setup 1.0.0.exe
```

### **To Build Mobile App:**
```powershell
cd d:\Rohinth\rohinth\chat\mobile
npx cap sync android
npx cap open android
# Then: Build → Build APK in Android Studio
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| **Backend API** | https://sample-template-bxgm.onrender.com |
| **Health Check** | https://sample-template-bxgm.onrender.com/health |
| **GitHub Repo** | https://github.com/rohinthtruelineresearch-cloud/sample-template |
| **Render Dashboard** | https://dashboard.render.com |

---

## ✅ Summary

**ONE GitHub Repository:**
- `rohinthtruelineresearch-cloud/sample-template`

**ONE Render Deployment:**
- `sample-template-bxgm.onrender.com` (connected to `sample-template` repo)

**TWO Client Apps:**
- Desktop (Electron) - Standalone installer (local development)
- Mobile (Android) - APK file (local development)

**ALL connected to:**
- Same backend server on Render
- Same MongoDB database
- Same real-time chat room

---

**Last Updated:** 2026-02-10

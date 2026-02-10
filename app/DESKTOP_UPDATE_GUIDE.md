# 🖥️ How to Update & Share Desktop App

This guide covers updating, building, and distributing your Windows desktop app.

---

## 🔨 Step 1: Update the Desktop App Code

The desktop app automatically connects to your server, so when you updated the server to session-only messages, the desktop app already uses the new behavior!

### **To Make Code Changes:**

1. **Edit files in the `app/` folder:**
   - `index.html` - UI and interface
   - `main.js` - Electron window configuration
   - Add any new features you want

2. **Update version number:**
   Edit `app/package.json`:
   ```json
   {
     "version": "1.1.0"  ← Change this (was 1.0.0)
   }
   ```

3. **Test your changes:**
   ```powershell
   cd d:\Rohinth\rohinth\chat\app
   npm start
   ```

---

## 📦 Step 2: Build the Installer (.exe)

### **Method 1: Build Installer (Recommended)**

This creates a Windows installer that users can download and run.

```powershell
cd d:\Rohinth\rohinth\chat\app
npm run dist
```

**Wait 2-5 minutes** for the build to complete.

### **Output Files:**

After building, you'll find:

```
app/release/
├── NotepadMessenger Setup 1.0.0.exe  ← Main installer (share this!)
├── win-unpacked/                      ← Portable version (optional)
└── builder-debug.yml                  ← Build info
```

**File sizes:**
- Installer: ~100-150 MB
- Portable: ~200 MB (unpacked)

---

## 📤 Step 3: Share the Desktop App

### **🆓 FREE Sharing Options:**

#### **Option 1: Google Drive (Easiest)**

1. **Upload installer to Google Drive:**
   - Go to: https://drive.google.com
   - Upload: `app/release/NotepadMessenger Setup 1.0.0.exe`
   - Right-click → Share → "Anyone with the link"
   - Copy the link

2. **Share the link:**
   ```
   Hey! 👋
   
   Download Notepad Messenger for Windows:
   [Your Google Drive Link]
   
   📥 To install:
   1. Download the installer
   2. Run "NotepadMessenger Setup.exe"
   3. Follow the installation wizard
   4. Launch from Start Menu or Desktop
   
   Features:
   ✅ Transparent overlay window
   ✅ Always-on-top notepad chat
   ✅ Session-based messaging
   ```

**Pros:** Easy, unlimited downloads  
**Cons:** Large file warnings from Drive

---

#### **Option 2: GitHub Releases (Professional)**

1. **Create a release:**
   ```powershell
   cd d:\Rohinth\rohinth\chat
   git add .
   git commit -m "Update desktop app to v1.1.0"
   git tag -a v1.1.0 -m "Desktop app v1.1.0 - Session-only messages"
   git push origin main
   git push origin v1.1.0
   ```

2. **Upload to GitHub:**
   - Go to: `https://github.com/YOUR_USERNAME/notepad-messenger/releases`
   - Click "Draft a new release"
   - Tag: `v1.1.0`
   - Title: `Notepad Messenger v1.1.0`
   - Description:
     ```markdown
     ## What's New
     - ✅ Session-only messaging (messages clear on refresh)
     - ✅ Improved performance
     - ✅ Bug fixes
     
     ## Download
     Windows: Download `NotepadMessenger-Setup-1.1.0.exe` below
     
     ## Installation
     1. Download the installer
     2. Run and follow the wizard
     3. Launch from Start Menu
     ```
   - Upload: `NotepadMessenger Setup 1.0.0.exe`
   - Click "Publish release"

3. **Share the release link:**
   ```
   https://github.com/YOUR_USERNAME/notepad-messenger/releases/latest
   ```

**Pros:** Professional, version control, changelog  
**Cons:** Requires GitHub account

---

#### **Option 3: WeTransfer (Quick Sharing)**

1. Go to: https://wetransfer.com
2. Upload installer
3. Get download link
4. Share via email/WhatsApp

**Pros:** Simple, no account needed  
**Cons:** Expires in 7 days

---

#### **Option 4: Direct File Share**

**Via Network/USB:**
- Copy `NotepadMessenger Setup 1.0.0.exe` to USB drive
- Share directly

**Via Email:**
- Most email providers block large files (>25MB)
- Use Google Drive or WeTransfer instead

---

## 🔄 Step 4: Users Install/Update

### **For New Users (First Install):**

1. Download `NotepadMessenger Setup.exe`
2. Double-click to run
3. Windows Defender may show a warning:
   - Click "More info"
   - Click "Run anyway"
4. Follow the installation wizard:
   - Choose installation location
   - Create desktop shortcut (optional)
   - Click "Install"
5. Launch from Start Menu or Desktop

### **For Existing Users (Update):**

**Manual Update Process:**
1. Download new version installer
2. Run the installer
3. It will detect existing installation
4. Choose "Update" or "Repair"
5. Installation completes - done!

**The new version will replace the old one automatically!**

---

## 🚀 Auto-Update Feature (Optional - Advanced)

### **Add Electron Auto-Updater:**

To enable automatic updates, you need to:

1. **Sign your app** (requires code signing certificate - costs ~$50-200/year)
2. **Host updates** on a server
3. **Add update code** to `main.js`

**For most users, manual updates work fine!**

---

## 📋 Build Checklist

Before building and sharing:

- [ ] Test app locally with `npm start`
- [ ] Update version number in `package.json`
- [ ] Commit changes to Git
- [ ] Run `npm run dist` to build
- [ ] Test the installer on a clean Windows machine
- [ ] Upload to sharing platform
- [ ] Create release notes/changelog
- [ ] Share download link with users

---

## 🎯 Complete Update Workflow

When you want to release a new version:

```powershell
# 1. Make your code changes in app/ folder

# 2. Update version
# Edit app/package.json → change "version": "1.1.0"

# 3. Test locally
cd d:\Rohinth\rohinth\chat\app
npm start

# 4. Build installer
npm run dist

# 5. Commit to Git
cd d:\Rohinth\rohinth\chat
git add .
git commit -m "Release desktop app v1.1.0"
git tag v1.1.0
git push origin main
git push origin v1.1.0

# 6. Upload installer to GitHub/Google Drive

# 7. Share the download link!
```

---

## 📝 Version Naming Convention

Use semantic versioning:

- `1.0.0` - Initial release
- `1.0.1` - Bug fixes (patch)
- `1.1.0` - New features (minor)
- `2.0.0` - Major changes (major)

**Example progression:**
```
1.0.0 → Initial release
1.0.1 → Fixed message bug
1.1.0 → Added emoji picker
1.2.0 → Added dark mode
2.0.0 → Complete UI redesign
```

---

## 🔧 Troubleshooting

### **Build fails:**
```powershell
# Clear cache and rebuild
cd app
Remove-Item -Recurse -Force release
npm run dist
```

### **App doesn't start:**
- Check if port 5000 is available
- Verify server URL in `index.html`

### **Windows Defender blocks installer:**
- This is normal for unsigned apps
- Users need to click "Run anyway"
- To avoid: Purchase code signing certificate ($200-$300/year)

---

## 🌟 Recommended Sharing Method

**For most use cases:**

1. **Build installer:**
   ```powershell
   cd app
   npm run dist
   ```

2. **Upload to Google Drive:**
   - Simple and works for everyone
   - Unlimited downloads
   - No account required for users

3. **Share the link:**
   - Via WhatsApp, Email, or messaging app

**For professional releases:**
- Use GitHub Releases with proper versioning

---

## 📦 What Users Download

**Installer file:**
- Name: `NotepadMessenger Setup 1.0.0.exe`
- Size: ~100-150 MB
- Installs to: `C:\Users\USERNAME\AppData\Local\Programs\NotepadMessenger`
- Creates: Start Menu shortcut, optional Desktop shortcut

**Portable version (optional):**
- Folder: `app/release/win-unpacked/`
- Size: ~200 MB
- No installation needed - just run `NotepadMessenger.exe`
- Good for USB drives or temporary use

---

## ✅ Quick Reference

```powershell
# Test app
cd d:\Rohinth\rohinth\chat\app
npm start

# Build installer
npm run dist

# Find installer
cd release
dir *.exe

# Upload to Google Drive and share!
```

---

**Need help with:**
1. Building the installer?
2. Setting up GitHub releases?
3. Code signing?
4. Auto-updates?

Let me know! 🚀

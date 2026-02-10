# 🔔 Desktop Notifications

## Overview
The desktop app now includes **native Electron notifications** that alert you when new messages arrive!

## ✨ Features

### 1. **Native Desktop Notifications**
- 🔔 System notifications using Electron's Notification API
- 🔊 Sound alerts for new messages
- 💬 Shows sender name and message preview
- 🖱️ Click notification to focus the app window

### 2. **Smart Notification Logic**
- ✅ Only shows for messages from **other users** (not your own)
- ✅ Notifications appear even when app is minimized
- ✅ Works in background
- ✅ Windows 10/11 Action Center integration

## 🎯 How It Works

### When You Receive a Message:
1. **Message arrives** via Socket.io
2. **Notification appears** in Windows Action Center
3. **Shows**: 
   - Title: "💬 Notepad Messenger"
   - Body: "Username: Message text..."
4. **Plays sound** (system default notification sound)
5. **Click notification** → App window focuses/restores

### Notification Behavior:
- ✅ Shows when app is **minimized**
- ✅ Shows when app is in **background**
- ✅ Shows when app is **focused** (less intrusive)
- ❌ Does **NOT** show for your own messages

## 🔧 Technical Implementation

### Files Modified:

#### 1. `app/index.html` - Renderer Process
Added notification function:
```javascript
function showNotification(msg) {
    // Don't notify for own messages
    if (msg.sender === username) return;

    // Create native notification
    const notification = new Notification('💬 Notepad Messenger', {
        body: `${msg.sender}: ${msg.text}`,
        silent: false, // Play sound
        urgency: 'normal'
    });

    // Click to focus window
    notification.onclick = () => {
        ipcRenderer.send('focus-window');
    };
}
```

#### 2. `app/main.js` - Main Process
Added IPC handler for focusing window:
```javascript
ipcMain.on('focus-window', () => {
    if (mainWindow.isMinimized()) {
        mainWindow.restore();
    }
    mainWindow.focus();
    mainWindow.show();
});
```

## 🎨 User Experience

### Scenario 1: App in Background
```
1. Someone sends: "Hello!"
2. Notification pops up: "User_123: Hello!"
3. You click notification
4. App window comes to front
```

### Scenario 2: App Minimized
```
1. Someone sends: "Are you there?"
2. Notification appears in Action Center
3. Sound plays
4. You click → App restores and focuses
```

### Scenario 3: You Send a Message
```
1. You type and send: "Yes!"
2. No notification (it's your message)
3. Clean experience, no spam
```

## 🎵 Notification Sounds

- Uses **Windows default notification sound**
- Can be customized per user in Windows settings
- Set `silent: true` in code to disable sound

## 🖼️ Notification Appearance

**Windows 10/11 Action Center:**
```
┌────────────────────────────────┐
│ 💬 Notepad Messenger           │
├────────────────────────────────┤
│ User_456: Hey, check this out! │
│                                │
│ Just now                       │
└────────────────────────────────┘
```

## ⚙️ Customization Options

### Change Notification Title:
```javascript
new Notification('Your Custom Title', { ... })
```

### Disable Sound:
```javascript
new Notification('Title', {
    body: 'Message',
    silent: true  // No sound
})
```

### Add Custom Icon:
```javascript
new Notification('Title', {
    body: 'Message',
    icon: path.join(__dirname, 'custom-icon.png')
})
```

### Change Urgency:
```javascript
new Notification('Title', {
    body: 'Message',
    urgency: 'critical'  // Options: low, normal, critical
})
```

## 🚀 Testing

### Test 1: Background Notification
1. Open the desktop app
2. Minimize or switch to another app
3. Send a message from mobile/another device
4. ✅ Notification should appear

### Test 2: Click to Focus
1. Receive a notification
2. Click on it
3. ✅ Desktop app should restore/focus

### Test 3: No Self-Notifications
1. Send a message from desktop app
2. ✅ Should NOT see notification for your own message

## 📊 Notification Permissions

Electron apps have **automatic notification permissions** on Windows. No user approval needed!

- ✅ Windows 10/11: Automatic
- ✅ macOS: User grants on first notification
- ✅ Linux: Depends on desktop environment

## 🎯 Benefits

✅ **Never miss a message** - Even when minimized  
✅ **Quick access** - Click to open app instantly  
✅ **Native integration** - Uses Windows Action Center  
✅ **Sound alerts** - Audible notification  
✅ **Smart filtering** - No spam from your own messages  

## 🔮 Future Enhancements (Optional)

1. **Do Not Disturb Mode** - Disable notifications at certain times
2. **Sound Customization** - Choose custom notification sounds
3. **Notification Grouping** - Group multiple messages
4. **Rich Notifications** - Add action buttons (Reply, Mute, etc.)
5. **Badges** - Show unread count on app icon
6. **Flash Window** - Blink taskbar when new message arrives
7. **Auto-close** - Dismiss notification after X seconds

## 📝 Notes

- Notifications respect Windows notification settings
- Users can disable notifications in Windows Settings → Notifications
- Notification history stored in Windows Action Center
- Works offline (shows when connection restored)

## ✅ Status

**Feature**: Desktop Notifications  
**Platform**: Electron Desktop App  
**Status**: ✅ Implemented  
**Tested**: Ready for testing  

## 🎉 Enjoy Your Notifications!

Your desktop app now has **native Windows notifications** to keep you updated on all new messages! 🔔

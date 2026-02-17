const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 350,
    height: 500,
    x: width - 370,
    y: height - 520,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: false, // Show in taskbar so user can restore from minimize
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  // Handle minimize event from renderer
  ipcMain.on('minimize-window', () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  // Handle focus event from notification click
  ipcMain.on('focus-window', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
      mainWindow.show();
    }
  });

  // Handle flash frame event from renderer
  ipcMain.on('flash-frame', () => {
    if (mainWindow) {
      mainWindow.flashFrame(true);
    }
  });

  // Handle mode change (Standard vs Taskbar)
  ipcMain.on('set-mode', (event, mode) => {
    if (!mainWindow) return;

    const display = screen.getPrimaryDisplay();
    const workArea = display.workAreaSize; // Usable area (excluding taskbar)
    const bounds = display.bounds;       // Full screen area (including taskbar)

    if (mode === 'taskbar') {
      // Taskbar Mode: Overlay ON TOP of the taskbar
      // Assuming taskbar is at bottom, height is usually around 40-50px
      // Position it at bottom-left, slightly offset from Start button
      
      const searchBarWidth = 400;
      const searchBarHeight = 46; // Matches Windows 11 search height
      
      // Calculate Y position to be inside the taskbar area
      // bounds.height is full height (e.g. 1080)
      // taskbar height is bounds.height - workArea.height (approx)
      // If taskbar is bottom, y should be bounds.height - taskbarHeight + padding
      
      // Simpler approach: place it at absolute bottom with slight lift
      const yPos = bounds.height - searchBarHeight - 2; 

      mainWindow.setSize(searchBarWidth, searchBarHeight);
      mainWindow.setPosition(100, yPos); // 100px from left (skips Start button)
      mainWindow.setAlwaysOnTop(true, 'screen-saver'); // Force on top of taskbar
      mainWindow.setSkipTaskbar(true); // Hide from taskbar (it IS the taskbar now)
    } else {
      // Standard Mode: Normal size at bottom right of work area
      mainWindow.setSize(350, 500);
      mainWindow.setPosition(workArea.width - 370, workArea.height - 520);
      mainWindow.setAlwaysOnTop(true, 'normal');
      mainWindow.setSkipTaskbar(false); // Show normally
    }
  });

  mainWindow.on('focus', () => {
    mainWindow.flashFrame(false);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

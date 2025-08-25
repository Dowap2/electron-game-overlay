const { app, BrowserWindow } = require("electron");
const path = require("path");

function createOverlay() {
  const overlayWin = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  overlayWin.setIgnoreMouseEvents(true, { forward: true });

  overlayWin.loadURL("http://localhost:3000");
}

app.whenReady().then(createOverlay);

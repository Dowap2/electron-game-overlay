const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const https = require("https");

let overlayWindow;

function createOverlay() {
  overlayWindow = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  overlayWindow.loadURL(
    process.env.ELECTRON_START_URL || "http://localhost:3000"
  );

  overlayWindow.setIgnoreMouseEvents(true);
}

app.whenReady().then(() => {
  createOverlay();
  startTFTWatcher();
});

function startTFTWatcher() {
  setInterval(async () => {
    try {
      const tftData = await fetchTFTData();
      overlayWindow.show();
      overlayWindow.webContents.send("update-tft", tftData);
    } catch (err) {
      // overlayWindow.hide();
    }
  }, 1000);
}

function fetchTFTData() {
  return 0;
}

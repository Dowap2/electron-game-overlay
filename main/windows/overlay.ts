import { BrowserWindow } from "electron";
import path from "path";

export function createOverlayWindow() {
  const overlayWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
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
  return overlayWindow;
}

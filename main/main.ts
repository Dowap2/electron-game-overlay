import { app } from "electron";
import { createLogWindow } from "./windows/log";
import { createOverlayWindow } from "./windows/overlay";
import { startTFTWatcher } from "./tft/watcher";

let overlayWindow;

app.whenReady().then(() => {
  const logWindow = createLogWindow();

  logWindow.webContents.once("did-finish-load", () => {
    overlayWindow = createOverlayWindow();
    startTFTWatcher(overlayWindow);
  });
});

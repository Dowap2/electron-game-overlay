"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const log_1 = require("./windows/log");
const overlay_1 = require("./windows/overlay");
const watcher_1 = require("./tft/watcher");
let overlayWindow;
electron_1.app.whenReady().then(() => {
    const logWindow = (0, log_1.createLogWindow)();
    logWindow.webContents.once("did-finish-load", () => {
        overlayWindow = (0, overlay_1.createOverlayWindow)();
        (0, watcher_1.startTFTWatcher)(overlayWindow);
    });
});

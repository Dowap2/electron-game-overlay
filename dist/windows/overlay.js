"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOverlayWindow = createOverlayWindow;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
function createOverlayWindow() {
    const overlayWindow = new electron_1.BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    overlayWindow.loadURL(process.env.ELECTRON_START_URL || "http://localhost:3000");
    overlayWindow.setIgnoreMouseEvents(true);
    return overlayWindow;
}

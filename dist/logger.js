"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogWindow = setLogWindow;
exports.logToWindow = logToWindow;
exports.flushLogQueue = flushLogQueue;
let logWindow = null;
const logQueue = [];
function setLogWindow(window) {
    logWindow = window;
}
function logToWindow(message) {
    if (!logWindow || logWindow.webContents.isLoading()) {
        logQueue.push(message);
    }
    else {
        logWindow.webContents.send("log", message);
    }
}
function flushLogQueue() {
    if (!logWindow)
        return;
    while (logQueue.length > 0) {
        logWindow.webContents.send("log", logQueue.shift());
    }
}

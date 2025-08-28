let logWindow = null;
const logQueue = [];
export function setLogWindow(window) {
    logWindow = window;
}
export function logToWindow(message) {
    if (!logWindow || logWindow.webContents.isLoading()) {
        logQueue.push(message);
    }
    else {
        logWindow.webContents.send("log", message);
    }
}
export function flushLogQueue() {
    if (!logWindow)
        return;
    while (logQueue.length > 0) {
        logWindow.webContents.send("log", logQueue.shift());
    }
}
//# sourceMappingURL=logger.js.map
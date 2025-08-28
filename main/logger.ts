import { BrowserWindow } from "electron";

let logWindow: BrowserWindow | null = null;
const logQueue: string[] = [];

export function setLogWindow(window: BrowserWindow) {
  logWindow = window;
}

export function logToWindow(message: any) {
  if (!logWindow || logWindow.webContents.isLoading()) {
    logQueue.push(message);
  } else {
    logWindow.webContents.send("log", message);
  }
}

export function flushLogQueue() {
  if (!logWindow) return;
  while (logQueue.length > 0) {
    logWindow.webContents.send("log", logQueue.shift());
  }
}

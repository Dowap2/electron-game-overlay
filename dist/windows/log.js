import { BrowserWindow } from "electron";
import path from "path";
import { flushLogQueue, logToWindow, setLogWindow } from "../logger.js";
export function createLogWindow() {
    const logWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    logWindow.loadFile(path.join(__dirname, "../../renderer.html"));
    logWindow.webContents.on("did-finish-load", () => {
        setLogWindow(logWindow);
        flushLogQueue();
        logToWindow("로그 창이 준비되었습니다!");
    });
    return logWindow;
}
//# sourceMappingURL=log.js.map
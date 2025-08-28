"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogWindow = createLogWindow;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const logger_1 = require("../logger");
function createLogWindow() {
    const logWindow = new electron_1.BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    logWindow.loadFile(path_1.default.join(__dirname, "../../renderer.html"));
    logWindow.webContents.on("did-finish-load", () => {
        (0, logger_1.setLogWindow)(logWindow);
        (0, logger_1.flushLogQueue)();
        (0, logger_1.logToWindow)("로그 창이 준비되었습니다!");
    });
    return logWindow;
}

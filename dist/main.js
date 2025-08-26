"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTFTData = fetchTFTData;
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
let overlayWindow;
let logWindow;
const logQueue = [];
// ────────── 로그 관련 ──────────
function logToWindow(message) {
    if (!logWindow || logWindow.webContents.isLoading()) {
        logQueue.push(message);
    }
    else {
        logWindow.webContents.send("log", message);
    }
}
function flushLogQueue() {
    while (logQueue.length > 0) {
        logWindow.webContents.send("log", logQueue.shift());
    }
}
// ────────── 로그 창 생성 ──────────
function createLogWindow() {
    logWindow = new electron_1.BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    logWindow.loadFile(path_1.default.join(__dirname, "../renderer.html"));
    logWindow.webContents.on("did-finish-load", () => {
        flushLogQueue();
        logToWindow("로그 창이 준비되었습니다!");
    });
}
// ────────── 오버레이 창 생성 ──────────
function createOverlay() {
    overlayWindow = new electron_1.BrowserWindow({
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
}
async function fetchTFTData() {
    const possiblePaths = [
        path_1.default.join(process.env.LOCALAPPDATA, "Riot Games/League of Legends/lockfile"),
        "C:/Riot Games/League of Legends/lockfile",
        "C:/Program Files/Riot Games/League of Legends/lockfile",
        path_1.default.join(process.env.LOCALAPPDATA, "Riot Games/Riot Client/lockfile"),
    ];
    const lockfilePath = possiblePaths.find(fs_1.default.existsSync);
    if (!lockfilePath || !fs_1.default.existsSync(lockfilePath)) {
        logToWindow("Lockfile 없음. 클라이언트를 켜고 게임을 실행하세요.");
        return [];
    }
    const content = fs_1.default.readFileSync(lockfilePath, "utf8");
    const [name, pid, port, password, protocol] = content.split(":");
    const agent = new https_1.default.Agent({ rejectUnauthorized: false });
    try {
        const phaseRes = await axios_1.default.get(`https://127.0.0.1:${port}/lol-gameflow/v1/gameflow-phase`, { httpsAgent: agent, auth: { username: "riot", password } });
        const dummyUser = { id: "123123", name: "한글이요 아기토끼궁둥이" };
        console.log(dummyUser);
        logToWindow(JSON.stringify(dummyUser, null, 2));
        logToWindow(`Game phase: ${phaseRes.data}`);
    }
    catch (err) {
        logToWindow(`Error fetching game phase: ${err.message}`);
    }
    try {
        const res = await axios_1.default.get("https://127.0.0.1:2999/liveclientdata/allgamedata", {
            httpsAgent: agent,
        });
        const data = res.data;
        logToWindow(`Game mode: ${data.gameData.gameMode}`);
        logToWindow(`Active player: ${data.activePlayer.summonerName}`);
        return []; // 여기서 필요한 Player[] 가공 가능
    }
    catch (err) {
        logToWindow(`Error fetching TFT data: ${err.message}`);
        return [];
    }
}
// ────────── TFT 감시 시작 ──────────
function startTFTWatcher() {
    setInterval(async () => {
        const tftData = await fetchTFTData();
        if (overlayWindow)
            overlayWindow.webContents.send("update-tft", tftData);
    }, 1000);
}
// ────────── 앱 초기화 ──────────
electron_1.app.whenReady().then(() => {
    createLogWindow();
    logWindow.webContents.once("did-finish-load", () => {
        createOverlay();
        startTFTWatcher();
    });
});

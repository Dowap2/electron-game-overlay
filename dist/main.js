"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTFTData = fetchTFTData;
const electron_1 = require("electron");
const axios_1 = __importDefault(require("axios"));
const { app, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");
console.log("main!");
let overlayWindow;
function createOverlay() {
    overlayWindow = new electron_1.BrowserWindow({
        width: 500,
        height: 300,
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
    overlayWindow.loadURL(process.env.ELECTRON_START_URL || "http://localhost:3000");
    overlayWindow.setIgnoreMouseEvents(true);
}
app.whenReady().then(() => {
    console.log("ready!");
    createOverlay();
    startTFTWatcher();
});
function startTFTWatcher() {
    console.log("startTFTWatcher!");
    setInterval(async () => {
        try {
            const tftData = await fetchTFTData();
            overlayWindow.show();
            overlayWindow.webContents.send("update-tft", tftData);
        }
        catch (err) {
            overlayWindow.hide();
        }
    }, 1000);
}
async function fetchTFTData() {
    console.log("fetchData");
    console.log("LOCALAPPDATA:", process.env.LOCALAPPDATA);
    const possiblePaths = [
        path.join(process.env.LOCALAPPDATA, "Riot Games/League of Legends/lockfile"),
        "C:/Riot Games/League of Legends/lockfile",
        "C:/Program Files/Riot Games/League of Legends/lockfile",
        path.join(process.env.LOCALAPPDATA, "Riot Games/Riot Client/lockfile"), // Riot Client도 fallback
    ];
    const lockfilePath = possiblePaths.find(fs.existsSync);
    if (!lockfilePath || !fs.existsSync(lockfilePath)) {
        console.log("Lockfile 없음. 클라이언트를 켜고 게임을 실행하세요.");
        return [];
    }
    console.log("lockfilePath exists?", fs.existsSync(lockfilePath));
    const content = fs.readFileSync(lockfilePath, "utf8");
    console.log("Lockfile content:", content); // username:riot, password 확인
    const [name, pid, port, password, protocol] = content.split(":");
    const agent = new https.Agent({ rejectUnauthorized: false });
    const phaseRes = await axios_1.default.get(`https://127.0.0.1:${port}/lol-gameflow/v1/gameflow-phase`, { httpsAgent: agent, auth: { username: "riot", password } });
    console.log("Game phase:", phaseRes.data);
    try {
        const config = {
            httpsAgent: agent,
            auth: { username: "riot", password },
        };
        const res = await axios_1.default.get(`https://127.0.0.1:${port}/lol-summoner/v1/current-summoner`, config);
        console.log(res);
        const players = res.data;
        // 내 기물 수 vs 상대방 기물 수 계산
        const myPlayer = players.find((p) => p.isLocalPlayer);
        const opponentPlayers = players.filter((p) => !p.isLocalPlayer);
        if (myPlayer) {
            console.log(`내 기물 수: ${myPlayer.units.length}`);
        }
        opponentPlayers.forEach((op, i) => {
            console.log(`상대 ${i + 1} (${op.summonerName}) 기물 수: ${op.units.length}`);
        });
        return players;
    }
    catch (err) {
        console.error("fetchTFTData 에러:", err.message);
        return [];
    }
}

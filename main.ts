import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

let overlayWindow: BrowserWindow;
let logWindow: BrowserWindow;
const logQueue: string[] = [];

// ────────── 로그 관련 ──────────
function logToWindow(message: any) {
  if (!logWindow || logWindow.webContents.isLoading()) {
    logQueue.push(message);
  } else {
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
  logWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  logWindow.loadFile(path.join(__dirname, "../renderer.html"));

  logWindow.webContents.on("did-finish-load", () => {
    flushLogQueue();
    logToWindow("로그 창이 준비되었습니다!");
  });
}

// ────────── 오버레이 창 생성 ──────────
function createOverlay() {
  overlayWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
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

  overlayWindow.loadURL(
    process.env.ELECTRON_START_URL || "http://localhost:3000"
  );

  overlayWindow.setIgnoreMouseEvents(true);
}

// ────────── TFT 데이터 가져오기 ──────────
interface Unit {
  character_id: string;
  tier: number;
  items: number[];
}

interface Player {
  summonerName: string;
  isLocalPlayer: boolean;
  units: Unit[];
}

export async function fetchTFTData(): Promise<Player[]> {
  const possiblePaths = [
    path.join(
      process.env.LOCALAPPDATA!,
      "Riot Games/League of Legends/lockfile"
    ),
    "C:/Riot Games/League of Legends/lockfile",
    "C:/Program Files/Riot Games/League of Legends/lockfile",
    path.join(process.env.LOCALAPPDATA!, "Riot Games/Riot Client/lockfile"),
  ];

  const lockfilePath = possiblePaths.find(fs.existsSync);

  if (!lockfilePath || !fs.existsSync(lockfilePath)) {
    logToWindow("Lockfile 없음. 클라이언트를 켜고 게임을 실행하세요.");
    return [];
  }

  const content = fs.readFileSync(lockfilePath, "utf8");
  const [name, pid, port, password, protocol] = content.split(":");
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const phaseRes = await axios.get(
      `https://127.0.0.1:${port}/lol-gameflow/v1/gameflow-phase`,
      { httpsAgent: agent, auth: { username: "riot", password } }
    );
    const dummyUser = { id: "123123", name: "한글이요 아기토끼궁둥이" };
    logToWindow(JSON.stringify(dummyUser, null, 2));
    logToWindow(`Game phase: ${phaseRes.data}`);
  } catch (err: any) {
    logToWindow(`Error fetching game phase: ${err.message}`);
  }

  try {
    const res = await axios.get(
      "https://127.0.0.1:2999/liveclientdata/allgamedata",
      {
        httpsAgent: agent,
      }
    );

    const data = res.data;

    logToWindow(`Game mode: ${data.gameData.gameMode}`);
    logToWindow(`Active player: ${data.activePlayer.summonerName}`);
    return []; // 여기서 필요한 Player[] 가공 가능
  } catch (err: any) {
    logToWindow(`Error fetching TFT data: ${err.message}`);
    return [];
  }
}

// ────────── TFT 감시 시작 ──────────
function startTFTWatcher() {
  setInterval(async () => {
    const tftData = await fetchTFTData();
    if (overlayWindow) overlayWindow.webContents.send("update-tft", tftData);
  }, 1000);
}

// ────────── 앱 초기화 ──────────
app.whenReady().then(() => {
  createLogWindow();
  logWindow.webContents.once("did-finish-load", () => {
    createOverlay();
    startTFTWatcher();
  });
});

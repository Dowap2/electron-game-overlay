import { BrowserWindow } from "electron";

const { app, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const https = require("https");

console.log("main!");

let overlayWindow: BrowserWindow;

function createOverlay() {
  overlayWindow = new BrowserWindow({
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

  overlayWindow.loadURL(
    process.env.ELECTRON_START_URL || "http://localhost:3000"
  );

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
    } catch (err) {
      overlayWindow.hide();
    }
  }, 1000);
}

interface Unit {
  id: number;
  name: string;
  icon: string;
  items: string[];
}

interface Player {
  name: string;
  health: number;
  units: Unit[];
}

async function fetchTFTData(): Promise<Player[]> {
  console.log("fetchData");
  console.log("LOCALAPPDATA:", process.env.LOCALAPPDATA);
  const possiblePaths = [
    path.join(
      process.env.LOCALAPPDATA!,
      "Riot Games/League of Legends/lockfile"
    ),
    "C:/Riot Games/League of Legends/lockfile",
    "C:/Program Files/Riot Games/League of Legends/lockfile",
  ];

  const lockfilePath = possiblePaths.find(fs.existsSync);

  if (!fs.existsSync(lockfilePath)) {
    console.log("Lockfile 없음. 클라이언트를 켜고 게임을 실행하세요.");
    return [];
  }
  console.log("lockfilePath exists?", fs.existsSync(lockfilePath));
  const content = fs.readFileSync(lockfilePath, "utf8");
  const [name, pid, port, protocol, password] = content.split(":");
  console.log(lockfilePath, name, pid, port, protocol, password);
  const agent = new https.Agent({ rejectUnauthorized: false });
  console.log(agent);
  const res = await axios.get(
    `https://127.0.0.1:${port}/lol-tft-game/v1/participants`,
    { httpsAgent: agent, auth: { username: "riot", password } }
  );

  const data: Player[] = res.data;
  console.log(res);
  return data;
}

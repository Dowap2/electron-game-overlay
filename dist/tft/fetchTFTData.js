"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTFTData = fetchTFTData;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../logger");
async function fetchTFTData() {
    const possiblePaths = [
        path_1.default.join(process.env.LOCALAPPDATA, "Riot Games/League of Legends/lockfile"),
        "C:/Riot Games/League of Legends/lockfile",
        "C:/Program Files/Riot Games/League of Legends/lockfile",
        path_1.default.join(process.env.LOCALAPPDATA, "Riot Games/Riot Client/lockfile"),
    ];
    const lockfilePath = possiblePaths.find(fs_1.default.existsSync);
    if (!lockfilePath) {
        (0, logger_1.logToWindow)("Lockfile 없음. 클라이언트를 켜고 게임을 실행하세요.");
        return [];
    }
    const content = fs_1.default.readFileSync(lockfilePath, "utf8");
    const [, , port, password] = content.split(":");
    const agent = new https_1.default.Agent({ rejectUnauthorized: false });
    try {
        const phaseRes = await axios_1.default.get(`https://127.0.0.1:${port}/lol-gameflow/v1/gameflow-phase`, { httpsAgent: agent, auth: { username: "riot", password } });
        (0, logger_1.logToWindow)(`Game phase: ${phaseRes.data}`);
    }
    catch (err) {
        (0, logger_1.logToWindow)(`Error fetching game phase: ${err.message}`);
    }
    try {
        const res = await axios_1.default.get("https://127.0.0.1:2999/liveclientdata/allgamedata", {
            httpsAgent: agent,
        });
        (0, logger_1.logToWindow)(`Game mode: ${res.data.gameData.gameMode}`);
        return [];
    }
    catch (err) {
        (0, logger_1.logToWindow)(`Error fetching TFT data: ${err.message}`);
        return [];
    }
}

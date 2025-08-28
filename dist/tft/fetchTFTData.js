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
function safeStringify(obj) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value))
                return "[Circular]";
            seen.add(value);
        }
        return value;
    }, 2);
}
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
        // const phaseRes = await axios.get(
        //   `https://127.0.0.1:${port}/lol-gameflow/v1/gameflow-phase`,
        //   { httpsAgent: agent, auth: { username: "riot", password } }
        // );
        // const phaseRes = await axios.get( //이거 내가 만든 팀 목록 가져오는 api임
        //   `https://127.0.0.1:${port}/lol-tft-team-planner/v1/sets/dirty`,
        //   { httpsAgent: agent, auth: { username: "riot", password } }
        // );
        const phaseRes = await axios_1.default.get(`https://127.0.0.1:${port}/lol-tft-skill-tree/v1/player-progression`, {
            httpsAgent: agent,
            auth: { username: "riot", password },
        });
        console.log(safeStringify(phaseRes.data));
        (0, logger_1.logToWindow)(safeStringify(phaseRes.data));
    }
    catch (err) {
        (0, logger_1.logToWindow)(`Error fetching game phase: ${err.message}`);
    }
    try {
        // const res = await axios.get("https://127.0.0.1:2999/tft-match/v1/players", {
        //   httpsAgent: agent,
        // });
        // const res = await axios.get("https://127.0.0.1:2999/tft-match/v1/game", {
        //   httpsAgent: agent,
        // });
        const res = await axios_1.default.get(`http://127.0.0.1:${port}/swagger/v1/api-docs`, { httpsAgent: agent, auth: { username: "riot", password } });
        console.log(res);
        // logToWindow(`res.data:\n${JSON.stringify(res.data, null, 2)}`);
        (0, logger_1.logToWindow)(`res.data:\n${safeStringify(res.data)}`);
        return [];
    }
    catch (err) {
        (0, logger_1.logToWindow)(`Error fetching TFT data: ${err.message}`);
        return [];
    }
}

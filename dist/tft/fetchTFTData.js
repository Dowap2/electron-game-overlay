import fs from "fs";
import path from "path";
import https from "https";
import axios from "axios";
function findLockfile() {
    const candidates = [
        "C:\\Riot Games\\League of Legends\\lockfile",
        "C:\\Riot Games\\Riot Client\\Config\\lockfile",
        path.join(process.env.LOCALAPPDATA || "", "Riot Games\\League of Legends\\lockfile"),
    ];
    for (const p of candidates) {
        try {
            if (fs.existsSync(p))
                return p;
        }
        catch { }
    }
    return null;
}
function readLockfile() {
    const file = findLockfile();
    if (!file)
        return null;
    const [name, pid, port, protocol, password] = fs
        .readFileSync(file, "utf8")
        .trim()
        .split(":");
    return { port, password };
}
let lcuClient = null;
function ensureLcu() {
    if (lcuClient)
        return lcuClient;
    const info = readLockfile();
    if (!info)
        return null;
    lcuClient = axios.create({
        baseURL: `https://127.0.0.1:${info.port}`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        auth: { username: "riot", password: info.password },
        timeout: 1000,
    });
    return lcuClient;
}
export async function getGameflowPhase() {
    console.log("a");
    try {
        const c = ensureLcu();
        if (!c)
            return "Unknown";
        const { data } = await c.get("/lol-gameflow/v1/gameflow-phase");
        console.log(data);
        return data;
    }
    catch {
        return "Unknown";
    }
}
export async function getCurrentSummoner() {
    try {
        const c = ensureLcu();
        if (!c)
            return null;
        const { data } = await c.get("/lol-summoner/v1/current-summoner");
        return { displayName: data.displayName, puuid: data.puuid };
    }
    catch {
        return null;
    }
}
export async function getLiveAllGameData() {
    try {
        const { data } = await axios.get("http://127.0.0.1:2999/liveclientdata/allgamedata", { timeout: 700 });
        return data;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=fetchTFTData.js.map
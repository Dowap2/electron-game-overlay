import path from "path";
import fs from "fs";
import https from "https";
import axios from "axios";
import { Player } from "../types";
import { logToWindow } from "../logger";

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
  if (!lockfilePath) {
    logToWindow("Lockfile 없음. 클라이언트를 켜고 게임을 실행하세요.");
    return [];
  }

  const content = fs.readFileSync(lockfilePath, "utf8");
  const [, , port, password] = content.split(":");
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const phaseRes = await axios.get(
      `https://127.0.0.1:${port}/lol-gameflow/v1/gameflow-phase`,
      { httpsAgent: agent, auth: { username: "riot", password } }
    );
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
    logToWindow(`Game mode: ${res.data.gameData.gameMode}`);
    return [];
  } catch (err: any) {
    logToWindow(`Error fetching TFT data: ${err.message}`);
    return [];
  }
}

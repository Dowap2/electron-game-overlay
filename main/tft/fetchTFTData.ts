import path from "path";
import fs from "fs";
import https from "https";
import axios from "axios";
import { Player } from "../types";
import { logToWindow } from "../logger";

function safeStringify(obj: any) {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      return value;
    },
    2
  );
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
  if (!lockfilePath) {
    logToWindow("Lockfile 없음. 클라이언트를 켜고 게임을 실행하세요.");
    return [];
  }

  const content = fs.readFileSync(lockfilePath, "utf8");
  const [, , port, password] = content.split(":");
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    // const phaseRes = await axios.get(
    //   `https://127.0.0.1:${port}/lol-gameflow/v1/gameflow-phase`,
    //   { httpsAgent: agent, auth: { username: "riot", password } }
    // );

    // const phaseRes = await axios.get( //이거 내가 만든 팀 목록 가져오는 api임
    //   `https://127.0.0.1:${port}/lol-tft-team-planner/v1/sets/dirty`,
    //   { httpsAgent: agent, auth: { username: "riot", password } }
    // );
    const phaseRes = await axios.get(
      `https://127.0.0.1:${port}/lol-tft-skill-tree/v1/player-progression`,
      {
        httpsAgent: agent,
        auth: { username: "riot", password },
      }
    );

    console.log(safeStringify(phaseRes.data));
    logToWindow(safeStringify(phaseRes.data));
  } catch (err: any) {
    logToWindow(`Error fetching game phase: ${err.message}`);
  }

  try {
    // const res = await axios.get("https://127.0.0.1:2999/tft-match/v1/players", {
    //   httpsAgent: agent,
    // });

    // const res = await axios.get("https://127.0.0.1:2999/tft-match/v1/game", {
    //   httpsAgent: agent,
    // });
    const res = await axios.get(
      `http://127.0.0.1:${port}/swagger/v1/api-docs`,
      { httpsAgent: agent, auth: { username: "riot", password } }
    );
    console.log(res);
    // logToWindow(`res.data:\n${JSON.stringify(res.data, null, 2)}`);
    logToWindow(`res.data:\n${safeStringify(res.data)}`);
    return [];
  } catch (err: any) {
    logToWindow(`Error fetching TFT data: ${err.message}`);
    return [];
  }
}

import { getGameflowPhase, getCurrentSummoner, getLiveAllGameData, } from "./fetchTFTData.js";
export function startWatcher(target) {
    console.log("tick");
    const tick = async () => {
        const gameflow = await getGameflowPhase();
        const summoner = await getCurrentSummoner();
        const liveData = gameflow === "InProgress" ? await getLiveAllGameData() : null;
        if (!target.isDestroyed()) {
            target.webContents.send("overlay:data", { gameflow, summoner, liveData });
        }
    };
    // 1초 폴링
    tick();
    return setInterval(tick, 1000);
}
//# sourceMappingURL=watcher.js.map
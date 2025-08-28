import { app } from "electron";
import { createOverlayWindow } from "./windows/overlay.js";
import { startWatcher } from "./tft/watcher.js";

// 디버그용 전역 로그
process.on("uncaughtException", (e) => console.error("[uncaughtException]", e));
process.on("unhandledRejection", (e) =>
  console.error("[unhandledRejection]", e)
);

let interval: ReturnType<typeof setInterval> | null = null;

console.log(
  "[main] boot. ELECTRON_START_URL =",
  process.env.ELECTRON_START_URL
);

app.whenReady().then(() => {
  try {
    console.log("[main] app ready");
    const url = process.env.ELECTRON_START_URL; // http://localhost:5173
    const win = createOverlayWindow(url || undefined);
    console.log("[main] window created");

    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    try {
      interval = startWatcher(win);
      console.log("[main] watcher started:", interval);
    } catch (err) {
      console.error("[main] startWatcher failed:", err);
    }
  } catch (e) {
    console.error("[main] error in whenReady", e);
  }
});

app.on("window-all-closed", () => {
  console.log("[main] window-all-closed");
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  app.quit();
});

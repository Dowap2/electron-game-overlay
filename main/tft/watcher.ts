import { BrowserWindow } from "electron";
import { fetchTFTData } from "./fetchTFTData";

export function startTFTWatcher(overlayWindow: BrowserWindow) {
  setInterval(async () => {
    const tftData = await fetchTFTData();
    overlayWindow.webContents.send("update-tft", tftData);
  }, 1000);
}

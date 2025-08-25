import { contextBridge, ipcRenderer } from "electron";

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

contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateTFT: (callback: (event: any, data: Player[]) => void) => {
    ipcRenderer.on("update-tft", callback);
  },
});

import { contextBridge, ipcRenderer } from "electron";

console.log("[preload] loaded");

contextBridge.exposeInMainWorld("overlay", {
  onData: (cb: (payload: any) => void) => {
    console.log("[preload] overlay.onData registered");
    ipcRenderer.on("overlay:data", (_e, payload) => cb(payload));
  },
});

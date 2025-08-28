// main/preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

console.log("[preload.cjs] loaded");

contextBridge.exposeInMainWorld("overlay", {
  onData: (cb) => {
    console.log("[preload.cjs] overlay.onData registered");
    ipcRenderer.on("overlay:data", (_e, payload) => cb(payload));
  },
});

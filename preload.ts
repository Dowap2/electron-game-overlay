const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateTFT: (callback) => ipcRenderer.on("update-tft", callback),
});

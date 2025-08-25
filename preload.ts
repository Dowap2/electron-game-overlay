import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendToMain: (channel: string, data: any) => ipcRenderer.send(channel, data),
  onFromMain: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (event, data) => callback(data));
  },
});

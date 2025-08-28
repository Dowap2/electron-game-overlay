const { ipcRenderer } = require("electron");

const logContainer = document.getElementById("log-container");

ipcRenderer.on("log", (event, message) => {
  const timestamp = new Date().toLocaleTimeString();
  const line = `[${timestamp}] ${message}\n`;
  logContainer.textContent += line;

  logContainer.scrollTop = logContainer.scrollHeight;
});

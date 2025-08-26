const { ipcRenderer } = require("electron");

const logContainer = document.getElementById("log-container");

// 새로운 로그가 오면 화면에 추가
ipcRenderer.on("log", (event, message) => {
  const timestamp = new Date().toLocaleTimeString();
  const line = `[${timestamp}] ${message}\n`;
  logContainer.textContent += line;

  // 스크롤 자동 이동
  logContainer.scrollTop = logContainer.scrollHeight;
});

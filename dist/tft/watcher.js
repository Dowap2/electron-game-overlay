"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTFTWatcher = startTFTWatcher;
const fetchTFTData_1 = require("./fetchTFTData");
function startTFTWatcher(overlayWindow) {
    setInterval(async () => {
        const tftData = await (0, fetchTFTData_1.fetchTFTData)();
        overlayWindow.webContents.send("update-tft", tftData);
    }, 1000);
}

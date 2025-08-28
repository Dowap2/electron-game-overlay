import { BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function createOverlayWindow(startUrl) {
    // 개발 환경에선 프로젝트 루트 기준으로 .cjs 원본을 직접 읽어도 OK
    // (패키징 시엔 build 스텝에서 복사해 dist에 두면 됨)
    const preloadPath = path.resolve(process.cwd(), "main/preload.cjs");
    console.log("[overlay] preload:", preloadPath);
    const win = new BrowserWindow({
        width: 720,
        height: 300,
        frame: false,
        transparent: false, // 디버깅 위해 잠깐 보이게
        backgroundColor: "#222222",
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: true,
        hasShadow: true,
        show: true,
        webPreferences: {
            preload: preloadPath, // ✅ CJS preload 사용
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (startUrl) {
        console.log("[overlay] loadURL:", startUrl);
        win.loadURL(startUrl);
    }
    else {
        const fallback = path.resolve(__dirname, "../../renderer/index.html");
        console.log("[overlay] loadFile:", fallback);
        win.loadFile(fallback);
    }
    win.webContents.on("did-finish-load", () => {
        console.log("[overlay] did-finish-load");
        win.webContents.openDevTools({ mode: "detach" });
    });
    win.webContents.on("did-fail-load", (_e, code, desc, url) => {
        console.error("[overlay] did-fail-load", { code, desc, url });
        const fallback = path.resolve(__dirname, "../../renderer/index.html");
        console.log("[overlay] fallback loadFile:", fallback);
        win.loadFile(fallback);
    });
    // 디버깅 시 클릭 허용
    win.setIgnoreMouseEvents(false);
    return win;
}
//# sourceMappingURL=overlay.js.map
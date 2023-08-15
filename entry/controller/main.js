"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const electron_reload_1 = __importDefault(require("electron-reload"));
const isDevMode = process.env.NODE_ENV !== "production";
if (isDevMode) {
    (0, electron_reload_1.default)(__dirname, {});
}
// to quit instead if its not
const isMac = process.platform == "darwin";
function createMainWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        title: "Image Resizer",
        width: 500,
        height: 600
    });
    //open devTools in dev mode
    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile(path_1.default.join(__dirname, "../view/index.html"));
}
electron_1.app.whenReady().then(() => {
    createMainWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createMainWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (!isMac) {
        electron_1.app.quit();
    }
});

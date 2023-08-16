"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const isDevMode = process.env.NODE_ENV !== "production";
// to quit instead if its not
const isMac = process.platform == "darwin";
function createMainWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        title: "Image Resizer",
        width: isDevMode ? 1000 : 500,
        height: 700
    });
    //open devTools in dev mode
    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile(path_1.default.join(__dirname, "../view/index.html"));
}
// Menu template
const menu = [
    {
        label: "File",
        submenu: [
            {
                label: "Quit",
                click: () => electron_1.app.quit(),
                accelerator: "CmdOrCtrl+Q"
            }
        ]
    }
];
// when app is ready
electron_1.app.whenReady().then(() => {
    createMainWindow();
    // implement menu
    const mainMenu = electron_1.Menu.buildFromTemplate(menu);
    electron_1.Menu.setApplicationMenu(mainMenu);
    // register activate event on app
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createMainWindow();
    });
});
// close all windows
electron_1.app.on("window-all-closed", () => {
    if (!isMac) {
        electron_1.app.quit();
    }
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const ipcmain_handlers_1 = require("./helpers/ipcmain-handlers");
const isDevMode = process.env.NODE_ENV !== "production";
// to quit instead if its not
const isMac = process.platform == "darwin";
// all windows
let mainWindow;
let aboutWindow;
// about window id
let aboutid;
function createMainWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        title: "Image Resizer",
        width: isDevMode ? 1000 : 460,
        height: 700,
        backgroundColor: "rgb(31, 41, 55)",
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path_1.default.join(__dirname, "./preload.js")
        }
    });
    //open devTools in dev mode
    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.loadFile(path_1.default.join(__dirname, "../view/index.html"));
    return mainWindow;
}
function createAboutWindow(parentwin) {
    const aboutWindow = new electron_1.BrowserWindow({
        title: "Image Resizer",
        width: 700,
        height: 500,
        parent: parentwin,
        modal: true,
        backgroundColor: "rgb(31, 41, 55)",
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path_1.default.join(__dirname, "./aboutPreload.js")
        }
    });
    aboutWindow.removeMenu();
    if (isDevMode) {
        aboutWindow.webContents.openDevTools();
    }
    aboutWindow.loadFile(path_1.default.join(__dirname, "../view/about.html"));
    aboutWindow.on("close", () => {
        aboutid = 0;
    });
    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show();
    });
    return aboutWindow;
}
// Menu template
const menu = [
    ...(isMac ? [{
            label: electron_1.app.name,
            submenu: [{
                    label: "About",
                    click: createAboutWindow
                }]
        }] : []),
    { role: "fileMenu" },
    ...(!isMac ? [{
            label: "Help",
            submenu: [{
                    label: "About",
                    click: () => {
                        if (aboutid) {
                            aboutWindow = electron_1.BrowserWindow.fromId(aboutid);
                            aboutWindow === null || aboutWindow === void 0 ? void 0 : aboutWindow.show();
                        }
                        else {
                            aboutWindow = createAboutWindow(mainWindow);
                            aboutid = aboutWindow.id;
                        }
                    }
                }]
        }] : []),
    {
        label: "leave",
        submenu: [
            {
                label: "Quit",
                click: electron_1.app.quit,
                accelerator: "CmdOrCtrl+Q"
            }
        ]
    }
];
// when app is ready..
electron_1.app.whenReady().then(() => {
    mainWindow = createMainWindow();
    // register events
    (0, ipcmain_handlers_1.allHandlers)(mainWindow);
    // implement menu
    // @ts-ignore
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

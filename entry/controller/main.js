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
let mainWindow;
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        title: "Image Resizer",
        width: isDevMode ? 1000 : 500,
        height: 700,
        backgroundColor: "rgb(31, 41, 55)",
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
// about window
let aboutid;
function createAboutWindow(parentwin) {
    const aboutWindow = new electron_1.BrowserWindow({
        title: "Image Resizer",
        width: 700,
        height: 500,
        parent: parentwin,
        modal: true,
        backgroundColor: "rgb(31, 41, 55)",
        webPreferences: {
            preload: path_1.default.join(__dirname, "./preload.js")
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
                            const aboutwin = electron_1.BrowserWindow.fromId(aboutid);
                            aboutwin === null || aboutwin === void 0 ? void 0 : aboutwin.show();
                        }
                        else {
                            const aboutwin = createAboutWindow(mainWindow);
                            aboutid = aboutwin.id;
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
    createMainWindow();
    // register events
    (0, ipcmain_handlers_1.allHandlers)();
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

import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import path from "path";
import { allHandlers } from "./helpers/ipcmain-handlers";

const isDevMode = process.env.NODE_ENV !== "production";

// to quit instead if its not
const isMac = process.platform == "darwin";

// all windows
let mainWindow: BrowserWindow | null;
let aboutWindow: BrowserWindow | null;
// about window id
let aboutid: number;

function createMainWindow() {
  const mainWin = new BrowserWindow({
    width: 500,
    height: 700,
    backgroundColor: "rgb(31, 41, 55)",
    frame: false,
    resizable: false,
    icon: path.join(__dirname, '../../assets/icons/icon_32x32.png'),
    webPreferences: {
      devTools: false,
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js"),
    }
  });

  //open devTools in dev mode...
  // if(isDevMode) {
  //   mainWin.webContents.openDevTools();
  // }

  // load UI to window's webcontents
  mainWin.loadFile(path.join(__dirname, "../view/index.html"));

  // handle events
  mainWin.once('ready-to-show', () => {
    mainWin.show();
  });

  mainWin.webContents.on("did-finish-load", () => {
    mainWin.setTitle("Image Resizer");
  });

  mainWin.on("closed", () => {
    mainWindow = null;
  });

  // return window's instance
  return mainWin;
}


function createAboutWindow(parentwin: BrowserWindow) {
  const aboutWin = new BrowserWindow({
    title: "Image Resizer",
    width: 460,
    height: 500,
    parent: parentwin,
    modal: true,
    backgroundColor: "rgb(31, 41, 55)",
    webPreferences: {
      devTools: false,
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "./aboutPreload.js")
    }
  });

  aboutWin.removeMenu();

  if(isDevMode){
    aboutWin.webContents.openDevTools();
  }

  aboutWin.loadFile(path.join(__dirname, "../view/about.html"));
  
  aboutWin.once('ready-to-show', () => {
    aboutWin.show();
  });

  aboutWin.on("closed", () => {
    aboutid = 0;
    aboutWindow = null
  });


  return aboutWin;
}


// Menu template
const menu = [
  ...(isMac? [{
    label: app.name,
    submenu: [{
      label: "About",
      click: createAboutWindow
    }]
  }] : []),

  {role: "fileMenu"},
  
  ...(!isMac? [{
    label: "Help",
    submenu: [{
      label: "About",
      click: () => {
        if(aboutid){
          aboutWindow = BrowserWindow.fromId(aboutid);
          aboutWindow?.show();
        }else {
          aboutWindow = createAboutWindow(mainWindow as BrowserWindow);
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
        click: app.quit,
        accelerator: "CmdOrCtrl+Q"
      }
    ]
  }
];


// when app is ready..
let tray;
app.whenReady().then(() => {
  mainWindow = createMainWindow();

  // register events
  allHandlers(mainWindow);
  
  // implement menu
  // @ts-ignore
  // const mainMenu = Menu.buildFromTemplate(menu);
  // Menu.setApplicationMenu(mainMenu);

  //
  // tray = new Tray(path.join(__dirname, '../../assets/icons/icon_32x32.png'))
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Item1', type: 'radio' },
  //   { label: 'Item2', type: 'radio' },
  //   { label: 'Item3', type: 'radio', checked: true },
  //   { label: 'Item4', type: 'radio' }
  // ])
  // tray.setToolTip('This is my application.')
  // tray.setContextMenu(contextMenu)

  // register activate event on app
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
      allHandlers(mainWindow);
    }
  });
});


// close all windows
app.on("window-all-closed", () => {
  if(!isMac) {
    app.quit();
  }
})
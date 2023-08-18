import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { allHandlers } from "./helpers/ipcmain-handlers";

const isDevMode = process.env.NODE_ENV !== "production";

// to quit instead if its not
const isMac = process.platform == "darwin";

let mainWindow: BrowserWindow
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isDevMode? 1000 : 500,
    height: 700,
    backgroundColor: "rgb(31, 41, 55)",
  });

  //open devTools in dev mode
  if(isDevMode) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  mainWindow.loadFile(path.join(__dirname, "../view/index.html"));
  return mainWindow;
}


// about window
let aboutid: number;
function createAboutWindow(parentwin: BrowserWindow) {
  const aboutWindow = new BrowserWindow({
    title: "Image Resizer",
    width: 700,
    height: 500,
    parent: parentwin,
    modal: true,
    backgroundColor: "rgb(31, 41, 55)",
    webPreferences: {
      preload: path.join(__dirname, "./preload.js")
    }
  });

  aboutWindow.removeMenu();
  if(isDevMode){
    aboutWindow.webContents.openDevTools();
  }
  aboutWindow.loadFile(path.join(__dirname, "../view/about.html"));

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
          const aboutwin = BrowserWindow.fromId(aboutid);
          aboutwin?.show();
        }else {
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
        click: app.quit,
        accelerator: "CmdOrCtrl+Q"
      }
    ]
  }
];


// when app is ready..
app.whenReady().then(() => {
  createMainWindow();

  // register events
  allHandlers();
  // implement menu
  // @ts-ignore
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // register activate event on app
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});


// close all windows
app.on("window-all-closed", () => {
  if(!isMac) {
    app.quit();
  }
})
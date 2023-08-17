import { app, BrowserWindow, Menu } from "electron";
import path from "path";

const isDevMode = process.env.NODE_ENV !== "production";

// to quit instead if its not
const isMac = process.platform == "darwin";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isDevMode? 1000 : 500,
    height: 700
  });

  //open devTools in dev mode
  if(isDevMode) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "../view/index.html"));
}


// about window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "Image Resizer",
    width: 500,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js")
    }
  });

  aboutWindow.loadFile(path.join(__dirname, "../view/about.html"));
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
      click: createAboutWindow
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
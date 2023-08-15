import {app, BrowserWindow} from "electron";
import path from "path";
import electronReload from "electron-reload";

const isDevMode = process.env.NODE_ENV !== "production";

if(isDevMode) {
  electronReload(__dirname, {});
}

// to quit instead if its not
const isMac = process.platform == "darwin";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: 500,
    height: 600
  });

  //open devTools in dev mode
  if(isDevMode) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "../view/index.html"));
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  })
});

app.on("window-all-closed", () => {
  if(!isMac) {
    app.quit();
  }
})
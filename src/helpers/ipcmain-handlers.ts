import { BrowserWindow, ipcMain, shell } from "electron";
import os from "os";
import path from "path";
import fs from "fs";
import resizeImg from "resize-img";

let mainWindow: BrowserWindow;
export function allHandlers(Mwindow: BrowserWindow) {
  mainWindow = Mwindow;
  handlersForTheHomeRenderer();
  handlersForTheAboutRenderer();
}


//
function handlersForTheHomeRenderer() {
  ipcMain.on("image:resize", (e, options) => {
    options.dest = path.join(os.homedir(), "imageResizer");
    resizer(options);
  });
}


//
function handlersForTheAboutRenderer() {
  ipcMain.handle("ping", () => `pong`);
}


/// All helpers functions needed
type resizeImageProps = {
  newWidth: string;
  newHeight: string;
  imgPath: string;
  dest: string
}

async function resizer({newWidth,newHeight,imgPath, dest}: resizeImageProps) {
  try {
    const image = await resizeImg(fs.readFileSync(imgPath), {
      width: +newWidth,
      height: +newHeight
    });

    const filename = path.basename(imgPath);

    // make dest dir if doesn't already exist
    if(!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // write to the dest the new image file
    fs.writeFileSync(path.join(dest, filename), image);

    // send message back to renderer
    mainWindow.webContents.send("image:done", path.join(dest, filename));
    // open the folder where the file was saved to
    shell.openPath(dest);
  } catch(error: any) {
    console.log(error);
  }
}
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allHandlers = void 0;
const electron_1 = require("electron");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resize_img_1 = __importDefault(require("resize-img"));
let mainWindow;
function allHandlers(Mwindow) {
    mainWindow = Mwindow;
    handlersForTheHomeRenderer();
    handlersForTheAboutRenderer();
}
exports.allHandlers = allHandlers;
//
function handlersForTheHomeRenderer() {
    electron_1.ipcMain.on("image:resize", (e, options) => {
        options.dest = path_1.default.join(os_1.default.homedir(), "imageResizer");
        resizer(options);
    });
}
//
function handlersForTheAboutRenderer() {
    electron_1.ipcMain.handle("ping", () => `pong`);
}
function resizer({ newWidth, newHeight, imgPath, dest }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const image = yield (0, resize_img_1.default)(fs_1.default.readFileSync(imgPath), {
                width: +newWidth,
                height: +newHeight
            });
            const filename = path_1.default.basename(imgPath);
            // make dest dir if doesn't already exist
            if (!fs_1.default.existsSync(dest)) {
                fs_1.default.mkdirSync(dest);
            }
            // write to the dest the new image file
            fs_1.default.writeFileSync(path_1.default.join(dest, filename), image);
            // send message back to renderer
            mainWindow.webContents.send("image:done", path_1.default.join(dest, filename));
            // open the folder where the file was saved to
            electron_1.shell.openPath(dest);
        }
        catch (error) {
            console.log(error);
        }
    });
}

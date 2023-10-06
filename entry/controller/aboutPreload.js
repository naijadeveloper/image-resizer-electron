"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("versions", {
    node: process.versions.node,
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    ping: () => electron_1.ipcRenderer.invoke("ping"),
});

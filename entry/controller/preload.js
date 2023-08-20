"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const toastify_js_1 = __importDefault(require("toastify-js"));
electron_1.contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    electron: () => process.versions.electron,
    chrome: () => process.versions.chrome,
    ping: () => electron_1.ipcRenderer.invoke("ping")
});
electron_1.contextBridge.exposeInMainWorld("os", {
    homedir: () => os_1.default.homedir()
});
electron_1.contextBridge.exposeInMainWorld("path", {
    join: (...args) => path_1.default.join(...args)
});
electron_1.contextBridge.exposeInMainWorld("Toastify", {
    toast: (options) => (0, toastify_js_1.default)(options).showToast()
});

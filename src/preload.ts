import { contextBridge, ipcRenderer } from "electron";
import os from "os";
import path from "path";
import Toastify from "toastify-js"

contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir()
});

contextBridge.exposeInMainWorld("path", {
  join: (...args: string[]) => path.join(...args)
});

contextBridge.exposeInMainWorld("Toastify", {
  toast: (options: Toastify.Options) => Toastify(options).showToast()
});

contextBridge.exposeInMainWorld("ipcRend", {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  on: (channel: string, func: (arg: any) => any) => ipcRenderer.on(channel, (event, arg) => func(arg))
});
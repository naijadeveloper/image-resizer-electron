import { contextBridge, ipcRenderer } from "electron";
import os from "os";
import path from "path";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  electron: () => process.versions.electron,
  chrome: () => process.versions.chrome,
  ping: () => ipcRenderer.invoke("ping")
});

contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir()
});

contextBridge.exposeInMainWorld("path", {
  join: (...args: string[]) => path.join(...args)
});
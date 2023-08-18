import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  electron: () => process.versions.electron,
  chrome: () => process.versions.chrome,
  ping: () => ipcRenderer.invoke("ping")
});
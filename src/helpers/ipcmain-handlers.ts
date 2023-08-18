import { ipcMain } from "electron";

export function allHandlers() {
  ipcMain.handle("ping", () => `pong`);
}
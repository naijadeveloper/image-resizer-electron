"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allHandlers = void 0;
const electron_1 = require("electron");
function allHandlers() {
    electron_1.ipcMain.handle("ping", () => `pong`);
}
exports.allHandlers = allHandlers;

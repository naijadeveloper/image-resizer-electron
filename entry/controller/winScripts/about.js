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
const extraInfo = document.querySelector("#extra-info");
const pingBtn = document.querySelector("#ping-btn");
extraInfo.textContent = `The version of node used is ${window.versions.node} and the version of electron is ${window.versions.electron} and that of chrome is ${window.versions.chrome}`;
pingBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield window.versions.ping();
    alert(`${res}`);
}));

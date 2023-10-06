"use strict";
const bgImage = document.querySelector("#bg-image");
const originDim = document.querySelector("#origin-dimensions");
const img = document.querySelector("#img");
const form = document.querySelector("#img-form");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");
const changeDim = document.querySelector("#change-dimensions");
const fileInfo = document.querySelector("#file-info");
const filename = document.querySelector("#filename");
const outputPath = document.querySelector("#output-path");
const outputPathParent = outputPath.parentElement;
const loader = document.querySelector(".loader");
const minimize_app = document.querySelector("#minimize-app");
const close_app = document.querySelector("#close-app");
const open_about_win = document.querySelector("#open-about-win");
// data needed to resize the image
let newWidth = "";
let newHeight = "";
let imgPath = "";
// All event listeners
img.addEventListener("change", loadImage);
widthInput.addEventListener("keyup", handleWidthChange);
heightInput.addEventListener("keyup", handleHeightChange);
form.addEventListener("submit", handleWidthAndHeightSubmit);
minimize_app.addEventListener("click", handleMinimizing);
close_app.addEventListener("click", handleClosing);
open_about_win.addEventListener("click", handleAboutWindowOpening);
// All Event handlers in order
function loadImage(e) {
    let file = this.files ? this.files[0] : null;
    if (file) {
        imgPath = file.path;
    }
    const acceptedImageTypes = ['image/gif', 'image/png', "image/jpeg"];
    // if file selected is not an image
    if (!(file && acceptedImageTypes.includes(file.type))) {
        notify("error", "THAT IS NOT PART OF THE ACCEPTABLE LIST OF IMAGES (GIF/PNG/JPEG)");
        newWidth = "";
        newHeight = "";
        // Necessary cleanups when the file gotten isn't accepted
        form.classList.remove('flex');
        form.classList.add("hidden");
        fileInfo.classList.remove("flex");
        fileInfo.classList.add("hidden");
        bgImage.style.backgroundImage = ``;
        bgImage.classList.add("drop-shadow-[0px_1px_2px_#030712]");
        bgImage.classList.remove("border-4");
        bgImage.classList.remove("border-gray-500");
        bgImage.classList.remove("hover:bg-[length:115%]");
        originDim.textContent = `PLEASE SELECT AN IMAGE TO RESIZE`;
        originDim.classList.remove("border-2");
        originDim.classList.remove("border-gray-900");
        outputPathParent.classList.add("hidden");
        outputPathParent.classList.remove("block");
        //
        file = null;
        this.value = '';
        return;
    }
    // get original dimensions
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        bgImage.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
        bgImage.classList.remove("drop-shadow-[0px_1px_2px_#030712]");
        bgImage.classList.add("border-4");
        bgImage.classList.add("border-gray-500");
        bgImage.classList.add("hover:bg-[length:115%]");
        originDim.textContent = `${image.width} X ${image.height}`;
        originDim.classList.add("border-2");
        originDim.classList.add("border-gray-900");
    };
    // else show form and file-info div
    form.classList.remove('hidden');
    form.classList.add("flex");
    fileInfo.classList.remove('hidden');
    fileInfo.classList.add("flex");
    // text content of filename
    filename.textContent = file.name;
    filename.title = file.name;
    outputPathParent.classList.remove("hidden");
    outputPathParent.classList.add("block");
    outputPath.textContent = window.path.join(window.os.homedir(), "imageResizer");
}
//
function handleWidthChange(e) {
    const valueArry = this.value.trim().split("");
    const newValueArry = valueArry.filter((value) => {
        if (isNaN(Number(value)) || value == "" || value == " ")
            return false;
        return true;
    });
    this.value = newValueArry.join("").trim();
    newWidth = newValueArry.join("").trim();
    // change button status if both width and height have values now
    if ((newWidth && newHeight) && (newWidth !== "0" && newHeight !== "0")) {
        changeDim.classList.remove("cursor-not-allowed");
        changeDim.classList.add("hover:drop-shadow-[0px_0px_0px_#030712]");
        changeDim.classList.add("hover:top-1");
        changeDim.title = "";
    }
    else {
        changeDim.classList.add("cursor-not-allowed");
        changeDim.classList.remove("hover:drop-shadow-[0px_0px_0px_#030712]");
        changeDim.classList.remove("hover:top-1");
        changeDim.title = "Fill out both width and height";
    }
}
//
function handleHeightChange(e) {
    const valueArry = this.value.trim().split("");
    const newValueArry = valueArry.filter((value) => {
        if (isNaN(Number(value)) || value == "" || value == " ")
            return false;
        return true;
    });
    this.value = newValueArry.join("").trim();
    newHeight = newValueArry.join("").trim();
    // change button status if both width and height have values now
    if ((newWidth && newHeight) && (newWidth !== "0" && newHeight !== "0")) {
        changeDim.classList.remove("cursor-not-allowed");
        changeDim.classList.add("hover:drop-shadow-[0px_0px_0px_#030712]");
        changeDim.classList.add("hover:top-1");
        changeDim.title = "";
    }
    else {
        changeDim.classList.add("cursor-not-allowed");
        changeDim.classList.remove("hover:drop-shadow-[0px_0px_0px_#030712]");
        changeDim.classList.remove("hover:top-1");
        changeDim.title = "Fill out both width and height";
    }
}
//
function handleWidthAndHeightSubmit(e) {
    e.preventDefault();
    if ((newWidth && newHeight && imgPath) && (newWidth !== "0" && newHeight !== "0")) {
        // console.log(Number(newWidth), "::::", Number(newHeight), ":::", imgPath);
        // send info about image to main process
        window.ipcRend.send("image:resize", {
            newWidth,
            newHeight,
            imgPath
        });
        // show loader
        loader.classList.remove('hidden');
        loader.classList.add("flex");
    }
    else {
        notify("error", "THE WIDTH AND/OR HEIGHT CAN'T BE 0");
    }
}
// Helper functions
// notify function
function notify(type, message) {
    window.Toastify.toast({
        text: message,
        duration: 3500,
        close: false,
        gravity: "bottom",
        className: `z-30 fixed flex items-center justify-center break-words w-[50%] min-h-[30px] rounded p-2 ${type == "success" ? "bg-green-700" : "bg-red-700"} text-gray-200 font-bold text-center mx-auto inset-x-0 drop-shadow-[0px_0.5px_1px_#030712] toast`,
    });
}
/// ipc main event handling
window.ipcRend.on("image:done", (arg) => {
    // hide loader
    loader.classList.remove('flex');
    loader.classList.add("hidden");
    // show notification
    notify("success", `THE NEW IMAGE HAS BEEN SAVED`);
});
// handle minimizing main window
function handleMinimizing() {
    window.ipcRend.send("minimize/main", {});
}
//handle closing main window
function handleClosing() {
    window.ipcRend.send("close/main", {});
}
//handle opening the about window
function handleAboutWindowOpening() {
    window.ipcRend.send("open/about", {});
}

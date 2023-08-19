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
// All event listeners
img.addEventListener("change", loadImage);
widthInput.addEventListener("keypress", handleWidthChange);
heightInput.addEventListener("keypress", handleHeightChange);
// All Event handlers in order
function loadImage(e) {
    let file = this.files ? this.files[0] : null;
    const acceptedImageTypes = ['image/gif', 'image/png', "image/jpeg"];
    // if file selected is not an image
    if (!(file && acceptedImageTypes.includes(file.type))) {
        originDim.textContent = `THAT IS NOT AN IMAGE`;
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
        setTimeout(() => { originDim.textContent = `PLEASE SELECT AN IMAGE TO RESIZE`; }, 2500);
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
function handleWidthChange(e) {
    const valueArry = this.value.split("");
    if (!Number(valueArry[valueArry.length - 1])) {
        valueArry.pop();
        this.value = valueArry.join("");
    }
}
function handleHeightChange(e) {
}

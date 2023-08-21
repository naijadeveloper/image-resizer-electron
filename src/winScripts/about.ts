const extraInfo = <HTMLParagraphElement>document.querySelector("#extra-info");
const pingBtn = <HTMLButtonElement>document.querySelector("#ping-btn");

interface Window {
  versions: {
    node: string, 
    electron: string, 
    chrome: string, 
    ping: () => string,
  }
}
extraInfo.textContent = `The version of node used is ${window.versions.node} and the version of electron is ${window.versions.electron} and that of chrome is ${window.versions.chrome}`

pingBtn.addEventListener("click", async () => {
  const res =  await window.versions.ping();
  alert(`${res}`);
});

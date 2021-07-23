const { app, BrowserWindow } = require("electron");

let timeBetweenBreaks = 5000;

function createWindow() {
  const win = new BrowserWindow({
    backgroundColor: "#282C34",
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreen: true,
    frame: false,
    opacity: 0.95,
  });

  win.loadFile("index.html");

  win.webContents.openDevTools();
  win.on("resize", (event) => {
    if (app.quitting) {
      win = null;
    } else {
      event.preventDefault();
      win.hide();
      setTimeout(function () {
        createWindow();
      }, timeBetweenBreaks);
    }
  });
  win.on("close", (event) => {
    app.quit();
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("before-quit", () => (app.quitting = true));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

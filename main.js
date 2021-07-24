const { app, BrowserWindow, Menu, Tray } = require("electron");
const fs = require("fs");

let preferences;
fs.readFile("preferences.json", function (err, data) {
  if (err) throw err;
  preferences = JSON.parse(data);
});

let appIcon = null;

let timeBetweenBreaks = 30000;

function createWindow() {
  const win = new BrowserWindow({
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreen: true,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: "./Assets/Icon.ico",
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

  addToTray();
}

function addToTray() {
  appIcon = new Tray("./Assets/Icon.ico");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit",
      type: "normal",
      click: () => {
        app.quit();
      },
    },
  ]);

  appIcon.setContextMenu(contextMenu);
}

app.on("ready", () => setTimeout(createWindow, 500));

app.on("before-quit", () => (app.quitting = true));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

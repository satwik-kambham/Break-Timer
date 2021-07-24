const { app, BrowserWindow, Menu, Tray } = require("electron");
const fs = require("fs");

let preferences;
fs.readFile("preferences.json", function (err, data) {
  if (err) throw err;
  preferences = JSON.parse(data);
});

let appIcon = null;
let firstTime = true;
let onBreak = false;
let timeBetweenBreaks = 20000;

function createWindow() {
  if (!onBreak) {
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
    onBreak = true;

    // win.webContents.openDevTools();
    win.on("close", (event) => {
      if (app.quitting) {
        win = null;
      } else {
        onBreak = false;
        event.preventDefault();
        win.hide();
        setTimeout(function () {
          createWindow();
        }, timeBetweenBreaks);
      }
    });

    if (firstTime) {
      addToTray();
      firstTime = false;
    }
  }
}

function addToTray() {
  appIcon = new Tray("./Assets/Icon.ico");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Take a break",
      type: "normal",
      click: () => {
        createWindow();
      },
    },
    {
      label: "Separator",
      type: "separator",
    },
    {
      label: "Quit",
      type: "normal",
      click: () => {
        console.log("Quitting");
        app.quit();
        return;
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

const { app, BrowserWindow, Menu, Tray, ipcMain } = require("electron");
const fs = require("fs");

const intervals = {
  "10 seconds": 10,
  "20 seconds": 20,
  "30 seconds": 30,
  "1 minute": 60,
  "2 minutes": 120,
  "5 minutes": 300,
  "10 minutes": 600,
  "15 minutes": 900,
  "20 minutes": 1200,
};

let appIcon = null;
let onBreak = false;
let paused = false;
let breakType = "s";

let preferences;

let id;
function timer() {
  let shortInterval = intervals[preferences.ShortBreak.Frequency];
  let longInterval = intervals[preferences.LongBreak.Frequency];
  let currentTime = 0;
  id = setInterval(() => {
    currentTime += 10;
    if (currentTime % longInterval == 0) {
      breakType = "l";
      createWindow();
    } else if (currentTime % shortInterval == 0) {
      breakType = "s";
      createWindow();
    }
  }, 10000);
}

function createWindow() {
  if (!paused && !onBreak) {
    createMainWindow(true);
  }
}

function createMainWindow() {
  let win = new BrowserWindow({
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
    }
  });
}

function addToTray() {
  appIcon = new Tray("./Assets/Icon.ico");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Take a short break",
      type: "normal",
      click: () => {
        breakType = "s";
        createMainWindow();
      },
    },
    {
      label: "Take a long break",
      type: "normal",
      click: () => {
        breakType = "l";
        createMainWindow();
      },
    },
    {
      label: "Toggle breaks",
      type: "normal",
      click: () => {
        paused = !paused;
        createWindow();
      },
    },
    {
      label: "Separator",
      type: "separator",
    },
    {
      label: "Pose game",
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
        app.quit();
        return;
      },
    },
  ]);

  appIcon.setContextMenu(contextMenu);
}

ipcMain.on("breakType", (event, arg) => {
  event.returnValue = breakType;
});

app.on("ready", () =>
  setTimeout(() => {
    fs.readFile("preferences.json", function (err, data) {
      if (err) throw err;
      preferences = JSON.parse(data);
      addToTray();
      timer();
    });
  }, 500)
);

app.on("before-quit", () => {
  app.quitting = true;
  clearInterval(id);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

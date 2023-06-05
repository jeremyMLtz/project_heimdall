import { app, BrowserWindow, ipcMain, screen, session } from "electron";
import psList from "ps-list";
const path = require("path");
const { saveData, loadData } = require("./savePreferences");

let mainWindow = null;
let preferencesWindow = null;
let processInterval;
let blockedApps = [];

app.on("ready", async () => {
  console.log(path.join(__dirname, "taskbar-icon.ico"));
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "/assets/taskbar-icon.ico"),
    width: 350,
    height: 100,
    x: width - 350,
    y: height - 100,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#2f3241",
      symbolColor: "#74b1be",
      height: 5,
    },
    webPreferences: {
      nodeIntegration: true, // Set nodeIntegration to true
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile("./pages/index.html");
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  blockedApps = loadData();
});

function shutDownApps(appList, blockedApps) {
  let appsToClose = [];
  appList.forEach((app) => {
    if (blockedApps.includes(app.name)) {
      appsToClose.push(app);
    }
  });
  appsToClose.forEach((app) => {
    process.kill(app.pid, "SIGTERM");
  });
}
function openPreferencesWindow() {
  preferencesWindow = new BrowserWindow({
    width: 400,
    height: 300,
    parent: mainWindow,
    modal: true,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#2f3241",
      symbolColor: "#74b1be",
      height: 5,
    },
    webPreferences: {
      nodeIntegration: true, // Set nodeIntegration to true
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  preferencesWindow.loadFile("./pages/preferences.html");
  preferencesWindow.webContents.on("dom-ready", () => {
    preferencesWindow.webContents.send("dataLoaded", blockedApps);
  });
}

ipcMain.on("toggleFocusMode", (event, focusModeActive) => {
  if (!focusModeActive) {
    clearInterval(processInterval);
  } else {
    try {
      let processes = [];
      processInterval = setInterval(async () => {
        processes = await psList();
        shutDownApps(processes, blockedApps);
      }, 2000);
    } catch (error) {
      console.error("Error retrieving process list:", error);
    }
  }
});

ipcMain.on("saveData", (event, newData) => {
  saveData(newData);
  blockedApps = newData;
  // send updated list back to front-end
  preferencesWindow.webContents.send("dataLoaded", blockedApps);
});

ipcMain.on("openPreferences", (event) => {
  openPreferencesWindow();
});

ipcMain.on("startTimer", (event, duration) => {
  setTimeout(() => {
    event.reply("timerExpired");
  }, duration);
});

// TODO: Add functionality to provide a list of installed apps where a user can select what to block
// function getInstalledApps() {
//   exec(
//     "reg query HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall /s",
//     (error, stdout) => {
//       if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//       }

//       // Extract the display names and executable file names of installed applications
//       const regex =
//         /DisplayName\s+REG_SZ\s+([^\r\n]+)[\s\S]+?DisplayIcon\s+REG_SZ\s+([^\r\n]+)/g;
//       let match;
//       const installedApps = [];
//       while ((match = regex.exec(stdout))) {
//         const displayName = match[1];
//         const displayIcon = match[2];
//         const fileName = displayIcon.split(",").shift();
//         installedApps.push({ displayName, fileName });
//       }

//       // Print the list of installed applications to the console
//       console.log(installedApps);
//     }
//   );
// }

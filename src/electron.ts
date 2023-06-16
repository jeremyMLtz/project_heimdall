import { app, BrowserWindow, ipcMain, Tray } from "electron";
import psList from "ps-list";
const path = require("path");
const { saveData, loadData } = require("./workspaceDataHelper.js");

let mainWindow = null;
let workspaceManager = null;
let tray = null;
let contextMenu = null;
let processInterval;
let workspaces = [];
// The workspace selected for editing
let selectedWorkspace;
// The active workspace for Focus Time
let activeWorkspace;
let focusMode = false;
let duration;
let timer;

app.on("ready", async () => {
  createTray();
  loadWorkspaces();
  createMainWindow();
  createContextMenu();
});
function createMainWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "./assets/taskbar-icon.png"),
    width: 850,
    height: 550,
    frame: false,
    show: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow
    .loadFile(path.join(__dirname, "./pages/index.html"))
    .then(() => mainWindow.show());
  mainWindow.webContents.on("dom-ready", () => {
    mainWindow.webContents.send("dataLoaded", workspaces);
    mainWindow.webContents.send("timeRemaining", duration);
    mainWindow.webContents.send("focusState", focusMode);
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, "./assets/tray-icon.png"));

  // Handle tray icon click event to show/hide the main window
  tray.on("click", () => {
    if (!mainWindow) {
      createMainWindow();
    } else {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });
  // Handle tray icon right-click event to show the custom context window
  tray.on("right-click", () => {
    const trayBounds = tray.getBounds();
    contextMenu.setPosition(trayBounds.x - 300, trayBounds.y - 400);
    contextMenu.show();
  });
}
function openWorkspaceManager() {
  workspaceManager = new BrowserWindow({
    icon: path.join(__dirname, "./assets/taskbar-icon.png"),
    width: 400,
    height: 600,
    parent: mainWindow,
    modal: true,
    frame: false,
    show: false,
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

  workspaceManager
    .loadFile(path.join(__dirname, "./pages/workspaceManager.html"))
    .then(() => workspaceManager.show());
  if (selectedWorkspace) {
    workspaceManager.webContents.on("dom-ready", () => {
      workspaceManager.webContents.send("workspaceLoaded", selectedWorkspace);
    });
  }
}
function createContextMenu() {
  contextMenu = new BrowserWindow({
    icon: path.join(__dirname, "./assets/taskbar-icon.png"),
    width: 300,
    height: 450,
    frame: false,
    show: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true, // Set nodeIntegration to true
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  contextMenu.loadFile(path.join(__dirname, "./pages/contextMenu.html"));
  contextMenu.webContents.on("dom-ready", () => {
    contextMenu.webContents.send("timeRemaining", duration);
    contextMenu.webContents.send("workspaceLoaded", activeWorkspace);
    contextMenu.webContents.send("focusState", focusMode);
  });
  contextMenu.on("blur", () => {
    contextMenu.hide();
  });
}

function loadWorkspaces() {
  workspaces = loadData();
  if (workspaces.length === 0) {
    return;
  }
  activeWorkspace = workspaces.find((workspace) => workspace.active === true);
}
function updateTimer() {
  if (focusMode) {
    if (duration <= 0) {
      clearInterval(timer);
      clearInterval(processInterval);
      focusMode = false;
      sendFocusState();
    } else {
      duration--;
    }
    mainWindow.webContents.send("timeRemaining", duration);
    contextMenu.webContents.send("timeRemaining", duration);
  }
}
function shutDownApps(appList) {
  let appsToClose = [];
  appList.forEach((app) => {
    if (activeWorkspace.blockedApps.includes(app.name)) {
      appsToClose.push(app);
    }
  });
  appsToClose.forEach((app) => {
    process.kill(app.pid, "SIGTERM");
  });
}

function sendFocusState() {
  if (mainWindow) {
    mainWindow.webContents.send("focusState", focusMode);
  }
  if (contextMenu) {
    contextMenu.webContents.send("focusState", focusMode);
  }
}

ipcMain.on("toggleFocusMode", (event, focusModeActive, totalSeconds) => {
  duration = totalSeconds;
  focusMode = focusModeActive;
  if (!focusMode) {
    if (timer) {
      clearInterval(timer);
    }
    clearInterval(processInterval);
  } else {
    try {
      if (duration > 0) {
        timer = setInterval(updateTimer, 1000);
      }
      let processes = [];
      processInterval = setInterval(async () => {
        processes = await psList();
        shutDownApps(processes);
      }, 2000);
      mainWindow.hide();
    } catch (error) {
      console.error("Error retrieving process list:", error);
    }
  }
  sendFocusState();
});

ipcMain.on("openWorkspaceManager", (event, workSpaceToEdit) => {
  if (workSpaceToEdit) {
    selectedWorkspace = workSpaceToEdit;
  } else {
    selectedWorkspace = null;
  }
  openWorkspaceManager();
});

ipcMain.on("saveWorkspace", (event, payload) => {
  payload.active = false;
  const updatedWorkspaces = workspaces;
  // If we're editing an existing workspace, find and update it, else create new workspace
  if (selectedWorkspace) {
    updatedWorkspaces.forEach((workspace, index) => {
      if (selectedWorkspace.name === workspace.name) {
        updatedWorkspaces[index].name = payload.name;
        updatedWorkspaces[index].blockedApps = payload.blockedApps;
      }
    });
    selectedWorkspace = null;
  } else {
    updatedWorkspaces.push(payload);
  }
  saveData(updatedWorkspaces);
  // close workspace manager and send new data to main App
  mainWindow.webContents.send("dataLoaded", updatedWorkspaces);
  workspaceManager.close();
  workspaceManager = null;
  loadWorkspaces();
});

ipcMain.on("setActiveWorkspace", (event, workspace) => {
  activeWorkspace = workspace;
  let updatedWorkspaces = workspaces;
  const workspaceToDeactivate = workspaces.find((ws) => ws.active === true);
  updatedWorkspaces.forEach((ws, index) => {
    // Deactivate old workspace
    if (workspaceToDeactivate?.name === ws.name) {
      updatedWorkspaces[index].active = false;
    }
    // Activate new workspace
    if (workspace.name === ws.name) {
      updatedWorkspaces[index].active = true;
    }
  });
  saveData(updatedWorkspaces);
  mainWindow.webContents.send("dataLoaded", updatedWorkspaces);
  loadWorkspaces();
});

ipcMain.on("deleteWorkspace", (event) => {
  let updatedWorkspaces = workspaces;
  updatedWorkspaces = updatedWorkspaces.filter(
    (ws) => ws.name !== selectedWorkspace.name
  );
  saveData(updatedWorkspaces);
  mainWindow.webContents.send("dataLoaded", updatedWorkspaces);
  workspaceManager.close();
  workspaceManager = null;
  selectedWorkspace = null;
  loadWorkspaces();
});

ipcMain.on("closeWorkspaceManager", (event) => {
  workspaceManager.close();
  workspaceManager = null;
  selectedWorkspace = null;
});

ipcMain.on("closeApp", (event) => {
  app.quit();
});

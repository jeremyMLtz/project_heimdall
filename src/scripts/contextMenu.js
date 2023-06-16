let focusModeActive = false;
const focusButton = document.getElementById("focusButton");
const workspaceName = document.getElementById("workspaceName");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const secondInput = document.getElementById("second-input");

window.ipcRenderer.on("focusState", (event, focusState) => {
  focusModeActive = focusState;
  updateFocusButton();
});

window.ipcRenderer.on("workspaceLoaded", (event, workspace) => {
  console.log(workspace);
  workspaceName.innerText = workspace.name;
});

window.ipcRenderer.on("timeRemaining", (event, duration) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  hourInput.value = hours.toString().padStart(2, "0");
  minuteInput.value = minutes.toString().padStart(2, "0");
  secondInput.value = seconds.toString().padStart(2, "0");
});

const toggleFocusMode = () => {
  // Get the user input
  const hours = parseInt(hourInput.value) || 0;
  const minutes = parseInt(minuteInput.value) || 0;
  const seconds = parseInt(secondInput.value) || 0;

  // Calculate the total seconds
  totalSeconds = hours * 3600 + minutes * 60 + seconds;
  focusModeActive = !focusModeActive;
  updateFocusButton();
  window.ipcRenderer.send("toggleFocusMode", focusModeActive, totalSeconds);
};
const updateFocusButton = () => {
  focusButton.className = focusModeActive ? "active" : "inactive";
};

const closeApp = () => {
  window.ipcRenderer.send("closeApp");
};

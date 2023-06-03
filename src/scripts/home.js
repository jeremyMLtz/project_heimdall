let focusModeActive = false;

const toggleFocusMode = () => {
  focusModeActive = !focusModeActive;
  focusButton.innerText = focusModeActive
    ? "Stop Focusing"
    : "Enter Focus Mode";
  window.ipcRenderer.send("toggleFocusMode", focusModeActive);
};

const openPreferences = () => {
  window.ipcRenderer.send("openPreferences");
};
ipcRenderer.on("timerExpired", () => {
  focusModeActive = false;
  window.ipcRenderer.send("toggleFocusMode", focusModeActive);
});
function startTimer() {
  const timerInput = document.getElementById("timerInput");
  const duration = parseInt(timerInput.value, 10);

  if (isNaN(duration) || duration <= 0) {
    return;
  }
  focusModeActive = true;
  window.ipcRenderer.send("startTimer", duration);
  window.ipcRenderer.send("toggleFocusMode", focusModeActive);
  timerInput.value = "";
}
document
  .getElementById("startTimerButton")
  .addEventListener("click", startTimer);

document.getElementById("timerInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startTimer();
  }
});

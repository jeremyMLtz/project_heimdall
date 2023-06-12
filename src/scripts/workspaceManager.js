let workspaceName;
let blockedApps = [];
const workspaceInput = document.getElementById("workspaceNameInput");
const deleteButton = document.getElementById("deleteWorkspace");
deleteButton.style.display = "none";
window.ipcRenderer.on("workspaceLoaded", (event, data) => {
  renderList(data.blockedApps);
  workspaceName = data.name;
  blockedApps = data.blockedApps;
  workspaceInput.value = workspaceName;
  deleteButton.style.display = "inline-block";
});

const createBlockedAppListItem = (appName) => {
  const listItem = document.createElement("li");
  const appTitle = document.createElement("span");
  const removeAppButton = document.createElement("button");
  listItem.id = `${appName}-item`;
  appTitle.textContent = appName;
  appTitle.className = "title";
  removeAppButton.id = appName;
  removeAppButton.className = "removeApp";
  removeAppButton.onclick = () => removeAppFromBlockList(removeAppButton.id);
  removeAppButton.textContent = "x";
  listItem.appendChild(appTitle);
  listItem.appendChild(removeAppButton);
  return listItem;
};

function renderList(data) {
  const appList = document.getElementById("appList");
  appList.innerHTML = "";

  data.forEach((item) => {
    const listItem = createBlockedAppListItem(item);
    appList.appendChild(listItem);
  });
}

const addAppToBlockList = (e) => {
  e.preventDefault();
  const newAppInput = document.getElementById("appNameInput");
  let newAppValue = newAppInput.value;
  if (newAppValue.trim() === "") {
    return;
  }
  blockedApps.push(newAppValue);
  // update and refresh list UI
  const appList = document.getElementById("appList");
  const listItem = createBlockedAppListItem(newAppValue);
  appList.appendChild(listItem);
  newAppInput.value = "";
};

const removeAppFromBlockList = (appName) => {
  blockedApps = blockedApps.filter((app) => app !== appName);
  const appList = document.getElementById("appList");
  const appItem = document.getElementById(`${appName}-item`);
  appList.removeChild(appItem);
};

const saveWorkspace = () => {
  const workspaceValue = workspaceInput.value;
  console.log(workspaceValue);
  if (workspaceValue.trim() === "") {
    return;
  }
  const payload = {
    name: workspaceValue,
    blockedApps,
  };
  window.ipcRenderer.send("saveWorkspace", payload);
};

const deleteWorkspace = () => window.ipcRenderer.send("deleteWorkspace");

const closeWorkspaceManager = () =>
  window.ipcRenderer.send("closeWorkspaceManager");

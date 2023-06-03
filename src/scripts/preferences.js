let blockedAppList;
window.ipcRenderer.on("dataLoaded", (event, data) => {
  renderList(data);
  blockedAppList = data;
});

const createBlockedAppListItem = (appName) => {
  const listItem = document.createElement("li");
  const appTitle = document.createElement("span");
  const removeAppButton = document.createElement("button");
  listItem.id = `${appName}-item`;
  appTitle.textContent = appName;
  appTitle.className = "title";
  removeAppButton.id = appName;
  removeAppButton.onclick = () => removeAppFromBlockList(removeAppButton.id);
  removeAppButton.textContent = "X";
  listItem.appendChild(appTitle);
  listItem.appendChild(removeAppButton);
  return listItem;
};

function renderList(data) {
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = "";

  data.forEach((item) => {
    const listItem = createBlockedAppListItem(item);
    dataList.appendChild(listItem);
  });
}

const addAppToBlockList = () => {
  const newAppInput = document.getElementById("appNameInput");
  let newAppValue = newAppInput.value;
  if (newAppValue.trim() === "") {
    return;
  }
  let newData = blockedAppList;
  newData.push(newAppValue);
  window.ipcRenderer.send("saveData", newData);
  // update and refresh list UI
  const dataList = document.getElementById("dataList");
  const listItem = createBlockedAppListItem(newAppValue);
  dataList.appendChild(listItem);
  newAppInput.value = "";
};

const removeAppFromBlockList = (appName) => {
  const newData = blockedAppList.filter((app) => app !== appName);
  window.ipcRenderer.send("saveData", newData);
  const dataList = document.getElementById("dataList");
  const appItem = document.getElementById(`${appName}-item`);
  dataList.removeChild(appItem);
};

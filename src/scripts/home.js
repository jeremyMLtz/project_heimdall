let focusModeActive = false;
const focusButton = document.getElementById("focusButton");
const createWorkspaceButton = document.getElementById("createWorkspace");
const wsContainer = document.getElementById("workspaces");
const emptyState = document.getElementById("emptyState");

window.ipcRenderer.on("dataLoaded", (event, data) => {
  const activeWorkspace = data.find((ws) => ws.active === true);
  // TODO: Implement a cleaner solution for refreshing the UI
  while (wsContainer.firstElementChild) {
    wsContainer.firstElementChild.remove();
  }
  if (!activeWorkspace) {
    focusButton.disabled = true;
  }
  if (data.length === 0) {
    focusButton.disabled = true;
    createWorkspaceButton.style.display = "none";
    emptyState.style.display = "block";
  } else {
    focusButton.disabled = false;
    createWorkspaceButton.style.display = "inline-block";
    emptyState.style.display = "none";
    data.forEach((workspace) => {
      const workSpaceCard = createWorkspaceCard(workspace);
      wsContainer.appendChild(workSpaceCard);
    });
  }
});

const createWorkspaceCard = (workspace) => {
  // card container
  const card = document.createElement("div");
  card.className = `workspace-card ${workspace.active ? "active-ws" : ""}`;
  card.id = workspace.name;
  // card header
  const header = document.createElement("div");
  header.className = "ws-card-header";
  header.onclick = () => setActiveWorkspace(workspace);
  header.role = "button";
  const title = document.createElement("span");
  title.className = "ws-title";
  title.textContent = workspace.name;
  const circleDiv = document.createElement("div");
  circleDiv.className = "circle";
  header.appendChild(title);
  header.appendChild(circleDiv);
  card.appendChild(header);
  // Blocklist details and edit buton
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "details-container";
  const blockedAppsCount = document.createElement("span");
  blockedAppsCount.className = "blocked-apps-count";
  blockedAppsCount.textContent = `Blocked Apps ${workspace.blockedApps.length}`;
  const editButton = document.createElement("button");
  editButton.className = "edit-workspace";
  editButton.textContent = "Edit";
  editButton.onclick = () => editWorkspace(workspace);
  detailsContainer.appendChild(blockedAppsCount);
  detailsContainer.appendChild(editButton);
  card.appendChild(detailsContainer);
  // create preview list of apps
  const blockedAppPreview = createBlockedAppsPreview(workspace.blockedApps);
  card.appendChild(blockedAppPreview);
  return card;
};

const createBlockedAppsPreview = (blockList) => {
  const slicedList = blockList.slice(0, 5); // Get the first five items
  const container = document.createElement("div");
  container.classList = "blocked-apps-preview";

  slicedList.forEach((item) => {
    const span = document.createElement("span");
    span.className = "blocked-app";
    span.textContent = item;
    container.appendChild(span);
  });

  if (blockList.length > 5) {
    const moreSpan = document.createElement("span");
    moreSpan.className = "blocked-app";
    moreSpan.textContent = "and more...";
    container.appendChild(moreSpan);
  }
  return container;
};

const toggleFocusMode = () => {
  focusModeActive = !focusModeActive;
  focusButton.innerText = focusModeActive
    ? "Stop Focusing"
    : "Enter Focus Mode";
  focusButton.className = focusModeActive ? "active" : "inactive";
  window.ipcRenderer.send("toggleFocusMode", focusModeActive);
};

const editWorkspace = (workspace) => {
  if (focusModeActive) {
    return;
  }
  window.ipcRenderer.send("openWorkspaceManager", workspace);
};

const setActiveWorkspace = (workspace) => {
  if (workspace.active || focusModeActive) {
    return;
  }
  window.ipcRenderer.send("setActiveWorkspace", workspace);
};

const openWorkspaceManager = () => {
  if (focusModeActive) {
    return;
  }
  window.ipcRenderer.send("openWorkspaceManager");
};

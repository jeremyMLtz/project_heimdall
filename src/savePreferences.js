const fs = require("fs");

const userPreferencesDirectory = "./userPreferences";
const filePath = "userPreferences/userPreferences.json";

// Function to load data from the file
function loadData() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    console.log(JSON.parse(data));
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or there's an error, return an empty array
    return [];
  }
}

// Function to save data to the file
function saveData(data) {
  if (!fs.existsSync(userPreferencesDirectory)) {
    fs.mkdirSync(userPreferencesDirectory);
  }
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData, "utf-8");
}

module.exports = { loadData, saveData };

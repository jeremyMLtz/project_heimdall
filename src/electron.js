/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/electron.ts":
/*!*************************!*\
  !*** ./src/electron.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (g && (g = 0, op[0] && (_ = 0)), _) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar electron_1 = __webpack_require__(/*! electron */ \"electron\");\nvar ps_list_1 = __webpack_require__(/*! ps-list */ \"./node_modules/ps-list/index.js\");\nvar path = __webpack_require__(/*! path */ \"path\");\nvar _a = __webpack_require__(/*! ./savePreferences */ \"./src/savePreferences.js\"), saveData = _a.saveData, loadData = _a.loadData;\nvar mainWindow = null;\nvar processInterval;\nvar blockedApps = [];\nelectron_1.app.on(\"ready\", function () { return __awaiter(void 0, void 0, void 0, function () {\n    return __generator(this, function (_a) {\n        mainWindow = new electron_1.BrowserWindow({\n            width: 800,\n            height: 600,\n            webPreferences: {\n                nodeIntegration: true,\n                contextIsolation: false,\n                preload: path.join(__dirname, \"preload.js\"),\n            },\n        });\n        mainWindow.loadFile(\"./pages/index.html\");\n        mainWindow.on(\"closed\", function () {\n            mainWindow = null;\n        });\n        blockedApps = loadData();\n        return [2 /*return*/];\n    });\n}); });\nfunction shutDownApps(appList, blockedApps) {\n    var appsToClose = [];\n    appList.forEach(function (app) {\n        if (blockedApps.includes(app.name)) {\n            appsToClose.push(app);\n        }\n    });\n    appsToClose.forEach(function (app) {\n        process.kill(app.pid, \"SIGTERM\");\n    });\n}\nfunction openPreferencesWindow() {\n    var preferencesWindow = new electron_1.BrowserWindow({\n        width: 400,\n        height: 300,\n        parent: mainWindow,\n        modal: true,\n        webPreferences: {\n            nodeIntegration: true,\n            contextIsolation: false,\n            preload: path.join(__dirname, \"preload.js\"),\n        },\n    });\n    preferencesWindow.loadFile(\"./pages/preferences.html\");\n    preferencesWindow.webContents.on(\"dom-ready\", function () {\n        preferencesWindow.webContents.send(\"dataLoaded\", blockedApps);\n    });\n}\nelectron_1.ipcMain.on(\"toggleFocusMode\", function (event, focusModeActive) {\n    if (!focusModeActive) {\n        clearInterval(processInterval);\n    }\n    else {\n        try {\n            var processes_1 = [];\n            processInterval = setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {\n                return __generator(this, function (_a) {\n                    switch (_a.label) {\n                        case 0: return [4 /*yield*/, (0, ps_list_1.default)()];\n                        case 1:\n                            processes_1 = _a.sent();\n                            shutDownApps(processes_1, blockedApps);\n                            return [2 /*return*/];\n                    }\n                });\n            }); }, 2000);\n        }\n        catch (error) {\n            console.error(\"Error retrieving process list:\", error);\n        }\n    }\n});\nelectron_1.ipcMain.on(\"saveData\", function (event, newData) {\n    saveData(newData);\n    blockedApps = newData;\n});\nelectron_1.ipcMain.on(\"openPreferences\", function (event) {\n    openPreferencesWindow();\n});\nelectron_1.ipcMain.on(\"startTimer\", function (event, duration) {\n    setTimeout(function () {\n        event.reply(\"timerExpired\");\n    }, duration);\n});\n// TODO: Add functionality to provide a list of installed apps where a user can select what to block\n// function getInstalledApps() {\n//   exec(\n//     \"reg query HKEY_LOCAL_MACHINE\\\\Software\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Uninstall /s\",\n//     (error, stdout) => {\n//       if (error) {\n//         console.error(`Error: ${error.message}`);\n//         return;\n//       }\n//       // Extract the display names and executable file names of installed applications\n//       const regex =\n//         /DisplayName\\s+REG_SZ\\s+([^\\r\\n]+)[\\s\\S]+?DisplayIcon\\s+REG_SZ\\s+([^\\r\\n]+)/g;\n//       let match;\n//       const installedApps = [];\n//       while ((match = regex.exec(stdout))) {\n//         const displayName = match[1];\n//         const displayIcon = match[2];\n//         const fileName = displayIcon.split(\",\").shift();\n//         installedApps.push({ displayName, fileName });\n//       }\n//       // Print the list of installed applications to the console\n//       console.log(installedApps);\n//     }\n//   );\n// }\n\n\n//# sourceURL=webpack://heimdall/./src/electron.ts?");

/***/ }),

/***/ "./src/savePreferences.js":
/*!********************************!*\
  !*** ./src/savePreferences.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const fs = __webpack_require__(/*! fs */ \"fs\");\r\n\r\nconst userPreferencesDirectory = \"./userPreferences\";\r\nconst filePath = \"userPreferences/userPreferences.json\";\r\n\r\n// Function to load data from the file\r\nfunction loadData() {\r\n  try {\r\n    const data = fs.readFileSync(filePath, \"utf-8\");\r\n    console.log(JSON.parse(data));\r\n    return JSON.parse(data);\r\n  } catch (error) {\r\n    // If the file doesn't exist or there's an error, return an empty array\r\n    return [];\r\n  }\r\n}\r\n\r\n// Function to save data to the file\r\nfunction saveData(data) {\r\n  if (!fs.existsSync(userPreferencesDirectory)) {\r\n    fs.mkdirSync(userPreferencesDirectory);\r\n  }\r\n  const jsonData = JSON.stringify(data, null, 2);\r\n  fs.writeFileSync(filePath, jsonData, \"utf-8\");\r\n}\r\n\r\nmodule.exports = { loadData, saveData };\r\n\n\n//# sourceURL=webpack://heimdall/./src/savePreferences.js?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "node:child_process":
/*!*************************************!*\
  !*** external "node:child_process" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:child_process");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:url":
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "./node_modules/ps-list/index.js":
/*!***************************************!*\
  !*** ./node_modules/ps-list/index.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var node_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:process */ \"node:process\");\n/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:util */ \"node:util\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! node:path */ \"node:path\");\n/* harmony import */ var node_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node:url */ \"node:url\");\n/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! node:child_process */ \"node:child_process\");\n\n\n\n\n\n\nconst __dirname = node_path__WEBPACK_IMPORTED_MODULE_2__.dirname((0,node_url__WEBPACK_IMPORTED_MODULE_3__.fileURLToPath)(\"file:///C:/Users/jerem/Documents/software_projects/project_heimdall/node_modules/ps-list/index.js\"));\n\nconst TEN_MEGABYTES = 1000 * 1000 * 10;\nconst execFile = (0,node_util__WEBPACK_IMPORTED_MODULE_1__.promisify)(node_child_process__WEBPACK_IMPORTED_MODULE_4__.execFile);\n\nconst windows = async () => {\n\t// Source: https://github.com/MarkTiedemann/fastlist\n\tlet binary;\n\tswitch (node_process__WEBPACK_IMPORTED_MODULE_0__.arch) {\n\t\tcase 'x64':\n\t\t\tbinary = 'fastlist-0.3.0-x64.exe';\n\t\t\tbreak;\n\t\tcase 'ia32':\n\t\t\tbinary = 'fastlist-0.3.0-x86.exe';\n\t\t\tbreak;\n\t\tdefault:\n\t\t\tthrow new Error(`Unsupported architecture: ${node_process__WEBPACK_IMPORTED_MODULE_0__.arch}`);\n\t}\n\n\tconst binaryPath = node_path__WEBPACK_IMPORTED_MODULE_2__.join(__dirname, 'vendor', binary);\n\tconst {stdout} = await execFile(binaryPath, {\n\t\tmaxBuffer: TEN_MEGABYTES,\n\t\twindowsHide: true,\n\t});\n\n\treturn stdout\n\t\t.trim()\n\t\t.split('\\r\\n')\n\t\t.map(line => line.split('\\t'))\n\t\t.map(([pid, ppid, name]) => ({\n\t\t\tpid: Number.parseInt(pid, 10),\n\t\t\tppid: Number.parseInt(ppid, 10),\n\t\t\tname,\n\t\t}));\n};\n\nconst nonWindowsMultipleCalls = async (options = {}) => {\n\tconst flags = (options.all === false ? '' : 'a') + 'wwxo';\n\tconst returnValue = {};\n\n\tawait Promise.all(['comm', 'args', 'ppid', 'uid', '%cpu', '%mem'].map(async cmd => {\n\t\tconst {stdout} = await execFile('ps', [flags, `pid,${cmd}`], {maxBuffer: TEN_MEGABYTES});\n\n\t\tfor (let line of stdout.trim().split('\\n').slice(1)) {\n\t\t\tline = line.trim();\n\t\t\tconst [pid] = line.split(' ', 1);\n\t\t\tconst value = line.slice(pid.length + 1).trim();\n\n\t\t\tif (returnValue[pid] === undefined) {\n\t\t\t\treturnValue[pid] = {};\n\t\t\t}\n\n\t\t\treturnValue[pid][cmd] = value;\n\t\t}\n\t}));\n\n\t// Filter out inconsistencies as there might be race\n\t// issues due to differences in `ps` between the spawns\n\treturn Object.entries(returnValue)\n\t\t.filter(([, value]) => value.comm && value.args && value.ppid && value.uid && value['%cpu'] && value['%mem'])\n\t\t.map(([key, value]) => ({\n\t\t\tpid: Number.parseInt(key, 10),\n\t\t\tname: node_path__WEBPACK_IMPORTED_MODULE_2__.basename(value.comm),\n\t\t\tcmd: value.args,\n\t\t\tppid: Number.parseInt(value.ppid, 10),\n\t\t\tuid: Number.parseInt(value.uid, 10),\n\t\t\tcpu: Number.parseFloat(value['%cpu']),\n\t\t\tmemory: Number.parseFloat(value['%mem']),\n\t\t}));\n};\n\nconst ERROR_MESSAGE_PARSING_FAILED = 'ps output parsing failed';\n\nconst psOutputRegex = /^[ \\t]*(?<pid>\\d+)[ \\t]+(?<ppid>\\d+)[ \\t]+(?<uid>[-\\d]+)[ \\t]+(?<cpu>\\d+\\.\\d+)[ \\t]+(?<memory>\\d+\\.\\d+)[ \\t]+(?<comm>.*)?/;\n\nconst nonWindowsCall = async (options = {}) => {\n\tconst flags = options.all === false ? 'wwxo' : 'awwxo';\n\n\tconst psPromises = [\n\t\texecFile('ps', [flags, 'pid,ppid,uid,%cpu,%mem,comm'], {maxBuffer: TEN_MEGABYTES}),\n\t\texecFile('ps', [flags, 'pid,args'], {maxBuffer: TEN_MEGABYTES}),\n\t];\n\n\tconst [psLines, psArgsLines] = (await Promise.all(psPromises)).map(({stdout}) => stdout.trim().split('\\n'));\n\n\tconst psPids = new Set(psPromises.map(promise => promise.child.pid));\n\n\tpsLines.shift();\n\tpsArgsLines.shift();\n\n\tconst processCmds = {};\n\tfor (const line of psArgsLines) {\n\t\tconst [pid, cmds] = line.trim().split(' ');\n\t\tprocessCmds[pid] = cmds.join(' ');\n\t}\n\n\tconst processes = psLines.map(line => {\n\t\tconst match = psOutputRegex.exec(line);\n\n\t\tif (match === null) {\n\t\t\tthrow new Error(ERROR_MESSAGE_PARSING_FAILED);\n\t\t}\n\n\t\tconst {pid, ppid, uid, cpu, memory, comm} = match.groups;\n\n\t\tconst processInfo = {\n\t\t\tpid: Number.parseInt(pid, 10),\n\t\t\tppid: Number.parseInt(ppid, 10),\n\t\t\tuid: Number.parseInt(uid, 10),\n\t\t\tcpu: Number.parseFloat(cpu),\n\t\t\tmemory: Number.parseFloat(memory),\n\t\t\tname: node_path__WEBPACK_IMPORTED_MODULE_2__.basename(comm),\n\t\t\tcmd: processCmds[pid],\n\t\t};\n\n\t\treturn processInfo;\n\t}).filter(processInfo => !psPids.has(processInfo.pid));\n\n\treturn processes;\n};\n\nconst nonWindows = async (options = {}) => {\n\ttry {\n\t\treturn await nonWindowsCall(options);\n\t} catch { // If the error is not a parsing error, it should manifest itself in multicall version too.\n\t\treturn nonWindowsMultipleCalls(options);\n\t}\n};\n\nconst psList = node_process__WEBPACK_IMPORTED_MODULE_0__.platform === 'win32' ? windows : nonWindows;\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (psList);\n\n\n//# sourceURL=webpack://heimdall/./node_modules/ps-list/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/electron.ts");
/******/ 	
/******/ })()
;
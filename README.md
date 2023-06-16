# project_heimdall
In Norse mythology, Heimdall was the watchman of Asgard, always keeping an eye out for intruders. Similarly, when you toggle on Focus Mode, the Heimdall app closes all the applications
that you have restricted and keeps an eye on your system processes and closes those apps if you try to open them again, eliminating all distractions.

![image](https://github.com/jeremyMLtz/project_heimdall/assets/42413866/64772a08-20dd-473f-9c00-3e4547615c1d)

## Using the App
1. You'll need to create your first workspace, to do so, simple click the Create Workspace button!
Then, just enter a name for your workspace and input a list of applications you wish to restrict.

![SetUp](https://github.com/jeremyMLtz/project_heimdall/assets/42413866/c66ce131-5aa8-4fdc-b60e-78ccab2c1104)
2. Now that we have a workspace (you can make as many as you need) we just need to set a timer and click `Enter Focus Zone`
and tada! All the applications in the blocklist of your active workspace will be closed and prevented from opening for the duration of the timer (Or until you manually turn off Focus Mode)

*You can also right-click the tray icon to open a simplified app window where you can toggle Focus Mode and see your timer duration without opening the main app*

![FocusMode](https://github.com/jeremyMLtz/project_heimdall/assets/42413866/cca1578d-eeb6-419d-aa8a-8a00589869b0)

## In the works
Just a list of some features being worked on

1. Add feature to let a user choose apps to block from a list of installed applications (Instead of needing to manually type the file name)
2. Mac support - This application has not yet been tested on a Mac
3. Refactoring and improving performance - This is currently just a proof of concept application I built for myself to help limit distractions, it could be improved :)

## Local Development
So you want to make some changes? No problem, here's how to set Heimdall up for local development!

The 3 main windows are as follows:
1. index/home - This is the main app window from here you can, set a timer, set an active workspace, toggle Focus Mode
2. workspaceManager - This is the window responsible for creating workspaces, you can name your workspace, add a list of blocked apps, delete a workspace, edit a current workspace, etc.
3. contextMenu - This is the custom menu shown when right-clicking the tray icon. From here you can toggle Focus Mode, set a timer, and quit the application

**Setup**
1. Run `npm i`
2. You can start the application in 2 modes
    - `npm start` - Runs webpack and then runs electron-forge
    - `npm run start:dev` - Runs webpack and then just runs electron *This skips electron-forge and gets you up and running a little quicker*
3. Start coding! Everything can be found in the src folder
    - `pages` contains the HTML files for each electron window
    - `styles` contains the css files for each electron window
    - `scripts` contains the js files for eact electron window


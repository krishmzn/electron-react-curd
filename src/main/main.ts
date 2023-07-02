/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import fs from 'fs';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// Custom

type Task = {
  id: number;
  title: string;
  description: string;
};

const filePath = './src/main/data.json'
let initialData: Data[] = []

type Data = {
  id: number;
  title: string;
  description: string;
}

ipcMain.on('get-json-item', (event, arg) => {
  console.log('ping');

  if (!fs.existsSync(filePath)) {
    // If the file does not exist, create it and write an initial value
    fs.writeFileSync(filePath, JSON.stringify(initialData));
  }

  // Read the JSON file
  const buffer = fs.readFileSync(filePath);
  const data = JSON.parse(buffer.toString('utf8'));

  // Extract the desired item
  // console.log('json-item is', data)

  // Send the item back to the renderer process
  event.sender.send('json-item', data);
});


// addtask
ipcMain.on('add-task', (event, newTask) => {
  console.log('Post add request received');

  // Read the JSON file
  const buffer = fs.readFileSync(filePath);
  const data = JSON.parse(buffer.toString('utf8'));

  // Add the new task to the data
  data.push(newTask);
  // console.log(newTask)
  // console.log(data)
  // Write the updated data back to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(data));
});


// deleteTask
ipcMain.on('delete-task', (event, taskId) => {
  console.log('Post delete request received');

  // Read the JSON file
  const data = fs.readFileSync(filePath, 'utf8');
  // Parse the contents of the file
  const tasks: Task[] = JSON.parse(data);
  // Filter out the task with the given taskId
  const updatedTasks = tasks.filter((task) => task.id !== taskId);

  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(updatedTasks));
});

// UpdateTask
ipcMain.on('update-task', (event, updatedTask) => {
  console.log('Post updated received');

  // Read the JSON file
  const data = fs.readFileSync(filePath, 'utf8');
  // Parse the contents of the file
  const tasks: Task[] = JSON.parse(data);
  // Update the task with the given taskId
  const updatedTasks = tasks.map((task) => {
    if (task.id === updatedTask.id) {
      return updatedTask;
    }
    return task;
  });
  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(updatedTasks));
});

'use strict';

// Import parts of electron to use
const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const path = require('path')
const url = require('url')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;

// Keep a reference for dev mode
let dev = false;
if ( process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath) ) {
  dev = true;
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, height: 768, show: false
  });

  tray = new Tray('./public/favicon.ico');

  // and load the index.html of the app.
  let indexPath;
  if ( dev && process.argv.indexOf('--noDevServer') === -1 ) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:4000',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL( indexPath );

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Open the DevTools automatically if developing
    if ( dev ) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // minimize event
  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
});

  const menu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(null);
    const contextMenu  = Menu.buildFromTemplate(contextMenuTemplate);
    tray.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

function smDownloads() {
  console.log('Downloads clicked');
  mainWindow.send(AUTO_DOWNLOAD_CLICK,{
    success: true,
    message: 'hai'
  })
}

function smSettings() {
  console.log('Setting clicked');
}

const mainMenuTemplate = [
  {
      label: 'File',
      submenu: [
          {
              label: 'Downloads', click() { smDownloads() }
          },
          {
              label: 'Settings', click() { smSettings() }
          }
      ]
  },
  {
      label: 'View',
      submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' }
      ]
  }
];

const contextMenuTemplate = [
  { label: 'Restore', click:  function(){
      mainWindow.show();
  } },
  {
      label: 'Auto Download',
      type:'checkbox',
      click: function(){
        smDownloads();
          console.log('Auto Download clicked');
      }
  },
  {
      label: 'Settings',
      click: function(){
          console.log('Settings clicked');
      }

  },
  { label: 'Quit', click:  function(){
      app.isQuiting = true;
      app.quit();
  } }
]; 

//IPC communication.
// ipcMain.on(AUTO_DOWNLOAD, (event,arg) =>{
//   console.log("here 001",arg);
// });



const fs = require('fs');

ipcMain.on('get-json-item', (event, arg) => {

  console.log('ping')
  // Read the JSON file
  const data = JSON.parse(fs.readFileSync('./data.json'));

  // Extract the desired item
  // console.log('json-item is', data)

  // Send the item back to the renderer process
  event.sender.send('json-item', data);
});


// addtask
ipcMain.on('add-task', (event, newTask) => {
  console.log('Post add request received')

  // Read the JSON file
  const data = JSON.parse(fs.readFileSync('./data.json'));

  // Add the new task to the data
  data.push(newTask);
  // console.log(newTask)
  // console.log(data)
  // Write the updated data back to the JSON file
  fs.writeFileSync('./data.json', JSON.stringify(data));
});

// deleteTask
ipcMain.on('delete-task', (event, taskId) => {
  console.log('Post delete request received')

  // Read the JSON file
  const data = fs.readFileSync('./data.json', 'utf8');
  // Parse the contents of the file
  const tasks = JSON.parse(data);
  // Filter out the task with the given taskId
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  // Write the updated data back to the file
  fs.writeFileSync('./data.json', JSON.stringify(updatedTasks));
});

// UpdateTask
ipcMain.on('update-task', (event, updatedTask) => {
  console.log('Post updated received')

  // Read the JSON file
  const data = fs.readFileSync('./data.json', 'utf8');
  // Parse the contents of the file
  const tasks = JSON.parse(data);
  // Update the task with the given taskId
  const updatedTasks = tasks.map(task => {
    if (task.id === updatedTask.id) {
      return updatedTask;
    }
    return task;
  });
  // Write the updated data back to the file
  fs.writeFileSync('./data.json', JSON.stringify(updatedTasks));
});
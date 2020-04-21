'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
var ready = false
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var custom = ""
let win
let win1
let first = true
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])


  function createWindow () {
      // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600, tabbingIdentifier:"wooow",webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      spellcheck: true
    } })
    win.custom = ""+custom // JOSH EDIT
    if(first)win.toggleTabBar()
    if(first)console.log("is first")
    if(first){ // if first 
      first = false;
      win1 = win
    }
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  custom=""
  win.on('closed', () => {
    win = null
  })
}

app.on("new-window-for-tab",()=>{
  console.log("new-window-for-tab event fired")
  try{
  addTab()
  }
  catch(err){
    console.log(err);
  }
})

function addTab(){
  let win = new BrowserWindow({ width: 800, height: 600,webPreferences: {
    nodeIntegration: true,
    webviewTag: true,
    spellcheck: true
  },
  tabbingIdentifier:"wooow",
  center: false,
  // parent:inp_win
})
win.custom = ""
if (process.env.WEBPACK_DEV_SERVER_URL) {
  // Load the url of the dev server if in development mode
  win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  // win.toggleTabBar();
  // if(win1)win.addTabbedWindow(win1);
  // win1 = win;
  if (!process.env.IS_TEST) win.webContents.openDevTools()
} else {
  createProtocol('app')
  // Load the index.html when not in development
  win.loadURL('app://./index.html')
}

win.on('closed', () => {
  win = null
})

  // inp_win.addTabbedWindow(win)

// win.addTabbedWindow(inp_win)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
    // custom=""
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }

  createWindow()
  // custom=""
  ready = true
})

//JOSH EDIT
app.on('open-file', (event,path) => {
  custom =path 
  if(ready){
    createWindow()
  }
  event.preventDefault()
})



// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



const process = require('process');
const path = require('path');
const url = require('url');
const { app, BrowserWindow, Menu } = require('electron');

let win = null;

function createWindow(){
  win = new BrowserWindow({
    width: 1400,
    height: 800,
    icon: path.join(__dirname, '../titleBarIcon.png')
  });

  if(process.env.NODE_ENV === 'development'){
    win.webContents.openDevTools();
  }

  win.loadURL(url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // 去掉顶层菜单
  Menu.setApplicationMenu(null);

  win.on('closed', ()=>{
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function(){
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate', function(){
  if(win === null){
    createWindow();
  }
});
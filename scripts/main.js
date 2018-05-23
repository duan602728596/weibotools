const path = require('path');
const url = require('url');
const process = require('process');
const { app, BrowserWindow, Menu } = require('electron');

let win = null;

function createWindow(){
  // 创建窗口.
  win = new BrowserWindow({
    width: 800,
    height: 600
  });

  // 开发者工具栏
  if(process.env.NODE_ENV === 'development'){
    win.webContents.openDevTools();
  }

  // 加载应用的index.html。
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // 去掉顶层菜单
  Menu.setApplicationMenu(null);
}

app.on('ready', createWindow);
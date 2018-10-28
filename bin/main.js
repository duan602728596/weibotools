const path = require('path');
const url = require('url');
const process = require('process');
const { app, BrowserWindow, Menu } = require('electron');

let win = null;

function createWindow(){
  // 创建窗口.
  win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  // 开发者工具栏
  if(process.env.NODE_ENV === 'development'){
    win.webContents.openDevTools();
  }

  // 加载应用的index.html
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // 去掉顶层菜单
  Menu.setApplicationMenu(null);

  win.on('closed', ()=>{
    // 解除窗口对象的引用，通常而言如果应用支持多个窗口的话，你会在一个数组里存放窗口对象，在窗口关闭的时候应当删除相应的元素。
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function(){
  // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate', function(){
  // 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他窗口打开
  if(win === null){
    createWindow();
  }
});
# 微博超话自动签到工具

## 软件下载链接
进入到[https://github.com/duan602728596/document/blob/master/48/README.md](https://github.com/duan602728596/document/blob/master/48/README.md)下载

## 许可证
本软件遵循**GNU General Public License v3.0**许可证。

## 技术栈
Pug + Scss + ECMAScript + Vue + Element + Webpack + Electron。

## 微博的lfid查找方法
[https://github.com/duan602728596/qqtools#微博的lfid查找方法](https://github.com/duan602728596/qqtools#微博的lfid查找方法)

## 注意
在生产环境编译时，由于配置问题，`file`文件夹会在`build`文件夹外，需要手动剪切到`build`文件夹内。

## 编译命令
* 输入命令 `$ npm start` 运行开发环境。
* 输入命令 `$ npm run runel` 运行开发环境的electron。
* 输入命令 `$ npm build` 编译到文件夹。
* 输入命令 `$ npm run asar` 编译asar文件。
* 输入命令 `$ npm run devdll` 编译开发环境dll文件。
* 输入命令 `$ npm run npmi` 或 `$ yarn run yarni` 安装生产环境依赖。
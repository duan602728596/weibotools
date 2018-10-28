import React, { Component, Fragment } from 'react';
import { Icon } from 'antd';
import style from './style.sass';
const { shell }: Object = global.require('electron');

class Index extends Component{
  // 打开默认浏览器
  handleOpenBrowser(href: string, event: Event): void{
    event.preventDefault();
    shell.openExternal(href);
  }
  render(): React.Element{
    return (
      <Fragment>
        <div className={ style.mb20 }>
          <p>
            欢迎使用微博工具。项目地址：
            <a onClick={ this.handleOpenBrowser.bind(this, 'https://github.com/duan602728596/weibotools') }>
              <Icon className={ style.github } type="github" theme="filled" />
              https://github.com/duan602728596/weibotools
            </a>
          </p>
          <h4>功能：</h4>
          <ul>
            <li>超级话题自动签到</li>
            <li>自动点赞</li>
            <li>批量取关功能</li>
            <li className={ style.todo }>TODO: 超话自动点赞</li>
            <li className={ style.todo }>TODO: 一键转发、评论微博</li>
            <li className={ style.todo }>TODO: 超话微博一键转发、评论</li>
          </ul>
        </div>
        <div>
          <p>欢迎对本软件进行打赏。</p>
          <img className={ style.img } src={ require('./zfb.webp') } />
          <img className={ style.img } src={ require('./wx.webp') } />
        </div>
      </Fragment>
    );
  }
}

export default Index;
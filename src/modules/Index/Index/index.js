import style from './style.sass';
const { shell }: Object = global.require('electron');

export default {
  methods: {
    // 打开默认浏览器
    handleOpenBrowser(href: string, event: Event): void{
      event.preventDefault();
      shell.openExternal(href);
    }
  },
  render(): Vue.VNode{
    return (
      <div>
        <p class={ style.text }>
          欢迎使用微博工具。项目地址：
          <a onClick={ this.handleOpenBrowser.bind(this, 'https://github.com/duan602728596/weibotools') }>
            <i-icon class={ style.github } type="logo-github" />
            https://github.com/duan602728596/weibotools
          </a>
        </p>
        <h4>功能：</h4>
        <ul class={ style.mb20 }>
          <li>超级话题自动签到</li>
          <li>自动点赞</li>
          <li>批量取关功能</li>
          <li class={ style.todo }>TODO: 超话自动点赞</li>
          <li class={ style.todo }>TODO: 一键转发、评论微博</li>
          <li class={ style.todo }>TODO: 超话微博一键转发、评论</li>
        </ul>
        <p class={ style.text }>欢迎对本软件进行打赏。</p>
        <img class={ style.img } src={ require('./zfb.webp') } />
        <img class={ style.img } src={ require('./wx.webp') } />
      </div>
    );
  }
};
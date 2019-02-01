import Header from '../Header/index';
import style from './style.sass';

/**
 * Arrangement
 * 页面整体布局
 * Header 显示页面header
 * Footer 显示版权信息
 * Routers 根据路由渲染页面
 */
export default {
  name: 'Arrangement',
  render(): Vue.VNode{
    return (
      <i-layout class={ style.layout }>
        <Header />
        <router-view />
        <i-footer class={ style.footer }>版权所有</i-footer>
      </i-layout>
    );
  }
};
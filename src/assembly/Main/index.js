import style from './style.sass';

/**
 * layout - main
 * 页面中部内容布局
 * 包含左侧的菜单Sider和右侧的内容Content
 */
export default {
  name: 'Main',
  render(): Vue.VNode{
    return (
      <i-layout className={ style.main }>
        { this.$slots.default }
      </i-layout>
    );
  }
};
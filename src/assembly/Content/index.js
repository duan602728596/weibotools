import style from './style.sass';

/**
 * layout - Content
 * 页面内容
 * 组件用于展示页面的内容
 * 默认padding为10px
 */
export default {
  name: 'Content',
  render(): Vue.VNode{
    return(
      <i-content class={ style.content }>
        { this.$slots.default }
      </i-content>
    );
  }
};
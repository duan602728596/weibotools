import style from './style.sass';

/**
 * layout - Sider
 * 页面左侧菜单
 * 渲染二级和三级菜单
 */
export default {
  name: 'Sider',
  props: ['options'],
  methods: {
    optionsView(options: Array, fatherIndex: number): Vue.VNode{
      return options.map((item: Object, index: number): Vue.VNode=>{
        if('children' in item && item.children.length > 0){
          const children: [] = this.optionsView(item.children, index);

          return (
            <i-submenu key={ item.id } name={ `submenu${ fatherIndex ? `-${ fatherIndex }` : '' }-${ index }` }>
              <template slot="title">{ item.name }</template>
              { children }
            </i-submenu>
          );
        }else{
          return (
            <i-menu-item key={ item.id } name={ `item${ fatherIndex ? `-${ fatherIndex }` : '' }-${ index }` }>
              <router-link class={ style.link } to={ item.url }>{ item.name }</router-link>
            </i-menu-item>
          );
        }
      });
    }
  },
  render(): Vue.VNode{
    return (
      <i-sider class={ style.sider } width="180">
        <i-menu width="180" default-active="">
          { this.optionsView(this.$props.options) }
        </i-menu>
      </i-sider>
    );
  }
};
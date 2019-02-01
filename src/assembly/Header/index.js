import style from './style.sass';

type options = {
  id: string,
  name: string,
  href: string,
  icon: string
};

export const navOptions: options[] = [
  {
    id: 'index',
    href: '/Index',
    icon: 'ios-home'
  }
];

/**
 * layout - header
 * 顶部header布局
 * 显示logo、导航、登录人信息等
 */
export default {
  name: 'Header',
  data(): Object{
    return {
      navOptions
    };
  },
  methods: {
    listView(navOptions: ArrayBuffer): Vue.VNode{
      return navOptions.map((item: Object, index: number): Vue.VNode=>{
        return (
          <li key={ index }>
            <router-link to={ item.href } active-class={ style.navActive }>
              { item.icon ? <i-icon size="20" type={ item.icon } /> : null }
              { item.name ? <span>{ item.name }</span> : null }
            </router-link>
          </li>
        );
      });
    }
  },
  render(): Vue.VNode{
    return (
      <i-header class={ style.header }>
        <h1 class={ style.logo }>微博管理工具</h1>
        <nav class={ style.nav }>
          <ul class="clearfix">{ this.listView(navOptions) }</ul>
        </nav>
      </i-header>
    );
  }
};
/* iview按需加载 */
import Vue from 'vue/dist/vue';
import { Layout, Header, Sider, Content, Footer, Menu, MenuItem, Submenu, Icon } from 'iview';
import 'iview/src/styles/index.less';

Vue.component('i-layout', Layout);
Vue.component('i-header', Header);
Vue.component('i-sider', Sider);
Vue.component('i-content', Content);
Vue.component('i-footer', Footer);
Vue.component('i-menu', Menu);
Vue.component('i-menu-item', MenuItem);
Vue.component('i-submenu', Submenu);
Vue.component('i-icon', Icon);
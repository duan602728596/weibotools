import Vue from 'vue/dist/vue';
import classNames from 'classnames';
import App from './AppModule.vue';
import { storeFactory } from './store/store';
import routers from './router/routers';
import './common.scss';
import './iview';
import './components/indexedDB/indexeddb-init';

/* app */
const app: Vue = new Vue({
  el: '#vue-app',
  store: storeFactory(window.__INITIAL_STATE__ || {}),
  router: routers,
  components: {
    App
  },
  template: '<App />'
});

Vue.prototype.classNames = classNames;
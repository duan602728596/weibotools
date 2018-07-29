import Vue from 'vue/dist/vue';
import App from './AppModule.vue';
import store from './store/store';
import routers from './router/routers';
import './common.scss';
import './element';
import './components/indexedDB/indexeddb-init';

/* app */
const app: Vue = new Vue({
  el: '#vue-app',
  store,
  router: routers,
  components: {
    App
  },
  template: '<App />'
});
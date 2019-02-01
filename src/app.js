import Vue from 'vue/dist/vue';
import './iview';
import App from './AppModule';
import { storeFactory } from './store/store';
import routers from './router/routers';
import './common.sass';

/* app */
const app: Vue = new Vue({
  el: '#app',
  store: storeFactory(window.__INITIAL_STATE__ || {}),
  router: routers,
  render(): Vue.VNode{
    return <App />;
  }
});
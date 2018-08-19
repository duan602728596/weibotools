import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router/dist/vue-router';
import Index from '../modules/Index/Index/index.vue';
import Login from 'bundle-loader?lazy&name=login!../modules/Login/Index/index.vue';
import Checkin from 'bundle-loader?lazy&name=check_in!../modules/Checkin/Index/index.vue';
import Dianzan from 'bundle-loader?lazy&name=dian_zan!../modules/Dianzan/Index/index.vue';

Vue.use(VueRouter);

const routers: VueRouter = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/Login',
      name: 'login',
      component: Login
    },
    {
      path: '/Checkin',
      name: 'checkin',
      component: Checkin
    },
    {
      path: '/Dianzan',
      name: 'request',
      component: Dianzan
    }
  ]
});

export default routers;
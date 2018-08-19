import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router/dist/vue-router';
import Index from '../modules/Index/Index/index.vue';

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
      component: (): Promise => import('../modules/Login/Index/index.vue')
    },
    {
      path: '/Checkin',
      name: 'checkin',
      component: (): Promise => import('../modules/Checkin/Index/index.vue')
    },
    {
      path: '/Dianzan',
      name: 'dianzan',
      component: (): Promise => import('../modules/Dianzan/Index/index.vue')
    },
    {
      path: '/FriendShip',
      name: 'friendship',
      component: (): Promise => import('../modules/FriendShip/Index/index.vue')
    }
  ]
});

export default routers;
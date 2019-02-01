import Vue from 'vue/dist/vue';
import VueRouter from 'vue-router/dist/vue-router';
import Index from '../modules/Index/Layout';

Vue.use(VueRouter);

const routers: VueRouter = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/Index'
    },
    {
      path: '/Index',
      name: 'index',
      component: Index
    },
    {
      path: '/Login',
      name: 'login',
      component: (): Promise => import('../modules/Login/Layout')
    }
  ]
});

export default routers;
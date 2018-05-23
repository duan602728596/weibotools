import Vue from 'vue/dist/vue';
import Vuex from 'vuex/dist/vuex';
import login from '../modules/Login/store/index';
import checkin from '../modules/Checkin/store/index';

Vue.use(Vuex);

const store: Vuex.Store = new Vuex.Store({
  modules: {
    login,
    checkin
  }
});

export default store;
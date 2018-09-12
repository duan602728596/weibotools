import Vue from 'vue/dist/vue';
import Vuex from 'vuex/dist/vuex';
import modules from './modules';

Vue.use(Vuex);

const store: Vuex.Store = {};

export function storeFactory(initialState: ?Object): Object{
  /* store */
  Object.assign(store, new Vuex.Store({
    state: initialState,
    modules
  }));

  return store;
}

export default store;
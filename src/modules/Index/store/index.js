export default {
  namespaced: true,
  state: {
    count: 0
  },
  getters: {
    getCount: (state: Object): Function => (): number => state.count
  },
  mutations: {
    add(state: Object): void{
      state.count++;
    }
  },
  actions: {
    add(context: Object, payload: Object): void{
      context.commit('add', payload);
    }
  }
};
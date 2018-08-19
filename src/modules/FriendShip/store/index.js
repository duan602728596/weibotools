export default {
  namespaced: true,
  state: {
    loginList: [],    // 账号登录列表
    frindShipList: [] // 关注列表
  },
  getters: {
    getLoginList: (state: Object): Function => (): Array => state.loginList,
    getFrindShipList: (state: Object): Function => (): Array => state.frindShipList
  },
  mutations: {
    loginList(state: Object, payload: Object): void{
      state.loginList = payload.data;
    },
    frindShipList(state: Object, payload: Object): void{
      state.frindShipList = payload.data;
    }
  },
  actions: {
    // 获取登录列表
    loginList(context: Object, payload: Object): void{
      context.commit('loginList', payload);
    },
    // 获取关注列表
    frindShipList(context: Object, payload: Object): void{
      context.commit('frindShipList', payload);
    }
  }
};
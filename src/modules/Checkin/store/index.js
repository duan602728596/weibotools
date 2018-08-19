export default {
  namespaced: true,
  state: {
    loginList: [] // 账号登录列表
  },
  getters: {
    getLoginList: (state: Object): Function => (): Array => state.loginList
  },
  mutations: {
    loginList(state: Object, payload: Object): void{
      state.loginList = [...payload.data];
    }
  },
  actions: {
    // 获取登录列表
    loginList(context: Object, payload: Object): void{
      context.commit('loginList', payload);
    }
  }
};
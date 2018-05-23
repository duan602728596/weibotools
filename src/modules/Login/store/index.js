export default {
  namespaced: true,
  state: {
    loginList: []  // 账号登录列表
  },
  getters: {
    getLoginList: (state: Object): Function => (): number => state.loginList
  },
  mutations: {
    loginList(state: Object, payload: Object): void{
      state.loginList = payload.data;
    },
    addLoginInformation(state: Object, payload: Object): void{
      state.loginList.push(payload.data);
    },
    deleteLoginInformation(state: Object, payload: Object): void{
      state.loginList.splice(payload.index, 1);
    }
  },
  actions: {
    // 获取登录列表
    loginList(context: Object, payload: Object): void{
      context.commit('loginList', payload);
    },
    // 添加一个登录信息
    addLoginInformation(context: Object, payload: Object): void{
      context.commit('addLoginInformation', payload);
    },
    // 删除一个登录信息
    deleteLoginInformation(context: Object, payload: Object): void{
      context.commit('deleteLoginInformation', payload);
    }
  }
};
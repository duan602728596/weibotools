export default {
  namespaced: true,
  state: {
    lfidList: []  // lfid列表
  },
  getters: {
    getLfidList: (state: Object): Function => (): Array => state.lfidList
  },
  mutations: {
    lfidList(state: Object, payload: Object): void{
      state.lfidList = payload.data;
    },
    deleteLfid(state: Object, payload: Object): void{
      state.lfidList.splice(payload.index, 1);
    }
  },
  actions: {
    // 获取登录列表
    lfidList(context: Object, payload: Object): void{
      context.commit('lfidList', payload);
    },
    // 删除一个lfid
    deleteLfid(context: Object, payload: Object): void{
      context.commit('deleteLfid', payload);
    }
  }
};

const MyposterModuleStore = {
  namespaced: true,
  state: {
    has_myposter_changed: false,
    myposter_changed_payloads: []
  },
  getters: {},
  mutations: {
    markMyposterChange(state, payload) {
      // console.info("MyposterModuleStore markMyposterChange", state, payload)
      if (!payload.change_type) throw new Error("请明确 myposter 更改的内容!");
      state.has_myposter_changed = true
      state.myposter_changed_payloads.push(payload)
    },
    resetMyposterChange(state, payload) {
      // console.info("MyposterModuleStore resetMyposterChange")
      state.has_myposter_changed = false;
      state.myposter_changed_payloads = [];
    }
  },
  actions: {}
};


export default MyposterModuleStore;

export { MyposterModuleStore }


const VerifyModuleStore = {
  namespaced: true,
  state: {
    submit_limit_time: 0
  },
  getters: {},
  mutations: {
    setSubmitLimitTime(state, payload) {
      console.info("VerifyModuleStore setSubmitLimitTime", payload)
      state.submit_limit_time = payload.limit_time;
    }
  },
  actions: {}
};


export default VerifyModuleStore;

export { VerifyModuleStore }

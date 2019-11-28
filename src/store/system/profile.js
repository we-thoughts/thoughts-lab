
const ProfileModuleStore = {
  namespaced: true,
  state: {
    has_email_changed: false,
    new_email: ""
  },
  getters: {},
  mutations: {
    markEmailChange(state, payload) {
      // console.info("ProfileModuleStore markEmailChange", state, payload)
      state.has_email_changed = true;
      state.new_email = payload.email;
    },
    resetEmailChange(state, payload) {
      // console.info("ProfileModuleStore resetEmailChange")
      state.has_email_changed = false;
      state.new_email = "";
    }
  },
  actions: {}
};


export default ProfileModuleStore;

export { ProfileModuleStore }

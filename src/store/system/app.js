
import ProfileModuleStore from './profile'
import VerifyModuleStore from './verify'

const SystemStore = {
  namespaced: true,
  modules: {
    profile: ProfileModuleStore,
    verify: VerifyModuleStore
  },
  state: {
  },
  mutations: {
  },
  actions: {},
  getters: {}
};

export default SystemStore;

export { SystemStore }

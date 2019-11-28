
import PosterModuleStore from './poster'
import MyposterModuleStore from './myposter'

const PosterStore = {
  namespaced: true,
  modules: {
    poster: PosterModuleStore,
    myposter: MyposterModuleStore
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {}
};


export default PosterStore;

export { PosterStore }

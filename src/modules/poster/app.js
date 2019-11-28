import GlobalStorage from '../../data/storage'
import Store from '../../store/index'
import PosterSubmodule from './poster'
import MyPosterSubmodule from './myposter'
import PublishSubmodule from './publish'

const APP_NAME = "poster";

let PosterStore = {
  state: Store.state[APP_NAME],
  getters(name) {
    return Store.getters[`${APP_NAME}/` + name]
  },
  commit(target) {
    Store.commit({ ...target, type: `${APP_NAME}/${target.type}` })
  },
  dispatch(target) {
    Store.dispatch({ ...target, type: `${APP_NAME}/${target.type}` })
  }
}
let poster = new PosterSubmodule(GlobalStorage)
let myposter = new MyPosterSubmodule(GlobalStorage)
let publish = new PublishSubmodule(GlobalStorage)

class PosterApp {
  constructor() { }
  markMyposterChange(payload) {
    // console.info("PosterApp markMyposterChange", payload)
    PosterStore.commit({ ...payload, type: "poster/markMyposterChange" })
    PosterStore.commit({ ...payload, type: "myposter/markMyposterChange" })
  }
}

let app = new PosterApp();

export default {
  app,
  poster,
  myposter,
  publish
}

export { app, poster, myposter, publish }

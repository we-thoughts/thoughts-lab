import GlobalStorage from '../../data/storage'
import Store from '../../store/index'

// 纯功能支持模块
import LoginSubmodule from './login'
// 包含页面实体的模块
import VerifySubmodule from './verify'
import ProfileSubmodule from './profile'
import CustomTabBarSubmodule from './custom-tab-bar'
import ChangelogSubmodule from './changelog'

const APP_NAME = "system";

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

let login = new LoginSubmodule(GlobalStorage)
let verify = new VerifySubmodule(GlobalStorage)
let profile = new ProfileSubmodule(GlobalStorage)
let custom_tab_bar = new CustomTabBarSubmodule(GlobalStorage)
let changelog = new ChangelogSubmodule(GlobalStorage)

class SystemApp {
  constructor() { }
  markEmailChange(payload) {
    console.info("SystemApp markEmailChange", payload)
    PosterStore.commit({ ...payload, type: "profile/markEmailChange" })
  }
}

let app = new SystemApp();

export default {
  app,
  login,
  verify,
  profile,
  custom_tab_bar,
  changelog
}

export {
  app,
  login,
  verify,
  profile,
  custom_tab_bar,
  changelog
}

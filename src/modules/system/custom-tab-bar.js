import * as Mobius from "../../libs/mobius";
let { AOP } = Mobius;

let GlobalStorage = null
let tabs = {};
let history = [];

class CustomTabBarModule {
  constructor(storage) {
    GlobalStorage = storage
  }
  initTab(tab) {
    let { path, page, tabbar } = tab;
    if (tabs[path]) return;
    tabs[path] = {
      page, tabbar
    }
    this._injectTab(tabbar)
  }
  _injectTab(tabbar) {
    AOP.inject("before")(tabbar, "switchTabTo", function (path) {
      history[history.length - 1] !== path && history.push(path)
    })
  }
}

export default CustomTabBarModule

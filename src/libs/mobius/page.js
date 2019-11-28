import * as AOPLib from './aop';
import { custom_tab_bar as CustomTabBar } from '../../modules/system';

let AOP = new AOPLib.AOP();

function tabbarHandle() {
  const page = this.$scope;
  if (typeof page.getTabBar === "function" && page.getTabBar()) {
    page.getTabBar().setData({
      _toPath: page.route
    });
  }
  CustomTabBar.initTab({
    path: page.route,
    page,
    tabbar: page.getTabBar()
  })
}

function page(meldOptions, pageOptions) {
  if (!pageOptions) pageOptions = meldOptions;
  pageOptions.mixins = pageOptions.mixins || [];
  pageOptions.mixins.push({
    onLoad() {
      AOP.inject("before")(this, "$options.onShow[0]", tabbarHandle)
    }
  })

  return pageOptions
}

export default page

export {
  page
}

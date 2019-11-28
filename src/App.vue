<script>
// 必须的库
require("./libs/sdk-wechat.3.1.0");

import { AppConfigurations } from "./basic";

import GlobalStorage from "./data/storage";
import * as CommonModule from "./modules/common";
import * as SystemModule from "./modules/system";

let { user: CommonUser } = CommonModule;
let { login: SystemLogin, credit: SystemCredit } = SystemModule;

export default {
  globalData: {
    appname: "Thoughts Daily",
    system_info: null
  },
  onLaunch: async function() {
    console.log("App Launch");
    // ifanr SDK verifies the client
    wx.BaaS.init(
      AppConfigurations.getConfigByPath(
        "services/ifanr-server/developer_id/client_id"
      )
    );

    // log in & set openid in GlobalStorage
    await SystemLogin.login();

    // ...
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  methods: {}
};
</script>

<style lang="scss">
/* 引入 weui 样式 */
@import "./css/weui/weui-new.css";
@import "./css/weui/weui-patch.css";
/* 引入 colorui 样式 */
@import "./css/colorui/main.css";
@import "./css/colorui/icon.css";
/* 引入自定义样式 */
/* 最终目标是孕育出成熟的扩展的、应用更广的类 weui 的 mobius ui 风格框架 */
/* 在融合完毕之前，最好最后引入 mobius 以覆盖某些样式 */
/* mobius 中定义的全局变量在 weui-patch 中会用到 */
@import "./css/mobius/mobius.scss";
</style>

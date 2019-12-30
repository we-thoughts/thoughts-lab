<script>
require("./libs/sdk-wechat.3.5.0");

import Enviornment from "./basic/env";

import LoginUsecase from "./domain/system/usecases/login.usecase";

export default {
  globalData: {
    appname: "Thoughts Lab",
    system_info: null
  },
  onLaunch: async function() {
    console.log("App Launch");

    // 小程序云能力初始化
    wx.cloud.init(Enviornment["server"]["wx-server"]);

    // ifanr SDK verifies the client
    wx.BaaS.init(
      Enviornment["server"]["ifanr-server"]["developer_id"]["client_id"],
      Enviornment["server"]["ifanr-server"]["options"]
    );

    // log in & set openid in GlobalStorage
    LoginUsecase.execute().subscribe();

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

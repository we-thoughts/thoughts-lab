import DEVELOPMENT_CONFIG from './appconfig.development.js'
import PRODUCTION_CFG from './appconfig.production.js'
import mapping from './appconfig.mapping.js';
import WXServices from '../data/wx-server';

const MODE = "production"; // development or production;

let AppConfigurations = {
  config: null,
  initConfig() {
    console.log(`AppConfigurations initConfig: enviornment => ${MODE}`)
    if (MODE === "development") {
      this.config = DEVELOPMENT_CONFIG;
    }
    if (MODE === "production") {
      let config_cache = wx.getStorageSync("configurations");
      this.config = config_cache || PRODUCTION_CFG;
      this.checkConfig(config_cache)
    }
  },
  async checkConfig(config_cache) {
    // 拉取远程配置
    if (!config_cache) {
      console.log("【配置】：拉取远程配置")
      config_cache = await WXServices.fetchConfig();
      wx.setStorageSync("configurations", config_cache)
    }
    // 设置过期时间
    if (config_cache.env === "server" && !config_cache.expire_time) {
      console.log("【配置】：设置过期时间")
      config_cache.expire_time = (config_cache.expire ? config_cache.expire * 1000 : 86400 * 1000) + (new Date().getTime());
      wx.setStorageSync("configurations", config_cache)
    }
    // 过期重新拉取
    if (config_cache.expire_time <= (new Date().getTime())) {
      console.log("【配置】：过期重新拉取")
      this.checkConfig(await WXServices.fetchConfig())
    }
  },
  getConfig: function (path) {
    return mapping[path]
  },
  getConfigByPath(path) {
    if (!this.config) this.initConfig();
    let frags = path.split('/')
    let res = this.config;
    for (let frag of frags) {
      res = res[frag]
    }
    // console.log(`请求配置：${path} => `, res)
    return res || this.config;
  }
}

export default AppConfigurations

export { AppConfigurations }

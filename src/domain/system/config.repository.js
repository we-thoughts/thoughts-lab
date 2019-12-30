import { from } from "rxjs";
import { map, tap, shareReplay } from "rxjs/operators";

import WxServerData from "../../data/wx-server";
import GlobalStorage from "../../data/storage";

const CACHE_SIZE = 1;

class ConfigRepository {

  cacheConfig$ = null;

  constructor() { }

  get config$() {
    if (!this.cacheConfig$) {
      this.cacheConfig$ = from(new Promise((resolve, reject) => {
        let config_cache = wx.getStorageSync("configurations");
        if (!config_cache || (config_cache.expire_time <= (new Date().getTime()))) {
          console.info("~~~~~~~~~~~~~~~~~~~~请求新的配置文件~~~~~~~~~~~~~~~~~~~~~~~~")
          resolve(WxServerData.fetchConfig())
        } else {
          console.info("~~~~~~~~~~~~~~~~~~~~返回缓存配置文件~~~~~~~~~~~~~~~~~~~~~~~~")
          resolve({ data: [config_cache] })
        }
      })).pipe(
        map(res => res.data[0]),
        map(config => {
          if (config.env === "server" && !config.expire_time) {
            config.expire_time = (config.expire ? config.expire * 1000 : 86400 * 1000) + (new Date().getTime());
          }
          return config;
        }),
        tap(config => {
            wx.setStorageSync("configurations", config)
            GlobalStorage.setData("config", config)
        }),
        shareReplay(CACHE_SIZE),
        tap(config => {
          if (config.expire_time <= (new Date().getTime())) {
            this.cacheConfig$ = null;
          }
        })
      )
    }
    return this.cacheConfig$;
  }
}

let SingleConfigRepository = new ConfigRepository();

export default SingleConfigRepository;

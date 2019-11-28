
// 引入配置文件
import { AppConfigurations } from "../../basic";
// 引入服务模块
import * as ServerServices from '../../data/ifanr-server'

const { POSTER_TAGS, REQUSET_PARAMS } = AppConfigurations.getConfigByPath("modules/poster/poster");
let { poster: PosterService } = ServerServices.poster;

let GlobalStorage = null;

class PosterModule {
  constructor(storage) {
    GlobalStorage = storage;
  }
  storage_fieldname = "posters"
  getPosterTags() {
    return [...POSTER_TAGS]
  }
  getRequestParams(field) {
    if (field) {
      return REQUSET_PARAMS[field] || REQUSET_PARAMS
    }
    return [...REQUSET_PARAMS]
  }
  setPosters(posters) {
    return GlobalStorage.setData(this.storage_fieldname, [].concat(posters))
  }
  async getPosters(options = { fresh: true }) {
    if (
      (options.fresh === false && GlobalStorage.getData(this.storage_fieldname).length === 0)
      || options.fresh === true
    ) {
      this.setPosters(await PosterService.requestPosters())
    }
    return GlobalStorage.getData(this.storage_fieldname)
  }
  async getPostersByTags(options = { fresh: false, tags: [] }) {
    let { tags } = options;
    // 空 tags 时必定一无所获
    if (tags.length === 0) return [];
    let posters = await this.getPosters(options);
    let res = [];
    for (let poster of posters) {
      tags.includes(poster.tag) && res.push(poster)
    }
    return res;
    // 完成之后做 loadmore 组件的点击加载
  }

  async getNewPosters() {
    let posters = GlobalStorage.getData(this.storage_fieldname)
    let new_posters = await PosterService.requestNewPosters(posters[0].created_at)
    if (new_posters.length > 0) {
      return this.setPosters(new_posters.concat(posters))
    }
    return false
  }

  async getOlderPosters() {
    let posters = GlobalStorage.getData(this.storage_fieldname)
    let older_posters = await PosterService.requestOlderPosters(posters[posters.length - 1].created_at)
    if (older_posters.length > 0) {
      return this.setPosters(posters.concat(older_posters))
    }
    return false
  }

  removePosterById(id) {
    let posters = GlobalStorage.getData(this.storage_fieldname)
    let new_posters = []
    for (let i = 0, len = posters.length; i < len; i++) {
      if (posters[i].id === id) continue
      new_posters.push(posters[i])
    }
    this.setPosters(new_posters)
  }

  revisePosterChanged(changed_payloads) {
    let res = {
      has_new_poster: false,
      has_poster_changed: false
    };
    if (changed_payloads.length === 0) return res;
    for (let payload of changed_payloads) {
      if (payload.change_type === "add") {
        res.has_new_poster = true;
      }
      if (payload.change_type === "delete") {
        res.has_poster_changed = true;
        this.removePosterById(payload.id);
      }
    }
    return res;
  }
}

export default PosterModule

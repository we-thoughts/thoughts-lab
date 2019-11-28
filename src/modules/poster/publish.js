// 引入服务模块
import * as ServerServices from '../../data/ifanr-server'
import * as CommonModules from '../common'
// 引入配置文件
import { AppConfigurations } from "../../basic";

let { file: FileService } = ServerServices.common;
let { poster: PosterService } = ServerServices.poster;
let { credit: CommonCredit } = CommonModules;
const { PUBLISH_TAGS, PUBLISH_OPT } = AppConfigurations.getConfigByPath("modules/poster/publish");

let GlobalStorage = null

class PublishModule {
  constructor(storage) {
    GlobalStorage = storage
  }

  async publishPoster(poster_data) {
    let { tag, title, content, pictures } = poster_data
    let pics = await FileService.uploadFiles(pictures, PUBLISH_OPT.picture_category_name)
    return PosterService.createPoster({ tag, title, content, pictures: pics })
  }

  async getPosterCredit(options = { fresh: true }) {
    // TODO: 若用户的 credit 无增长空间，可打标识以省略一次请求
    return (await CommonCredit.getCreditInfo(options)).poster_credit
  }

  getPublishTags() {
    return [].concat(PUBLISH_TAGS)
  }

  checkPublishPoster(poster_info) {
    let { tag, title, content, pictures } = poster_info;
    let res = {};
    if (!(res["tag"] = PUBLISH_TAGS.includes(tag))) { return res; }
    // TODO: 增强文本检测 & 添加相应提示
    if (!(res["title"] = title !== "")) { return res; }
    if (!(res["content"] = content !== "")) { return res; }
    // TODO: 增加图片检测并添加提示
    res["pictures"] = true;
    return res;
  }

  async checkPosterCredit(myposter_count) {
    let poster_credit = await this.getPosterCredit({ fresh: true });
    let res = {poster_credit};
    if (res["no_poster_credit"] = poster_credit === 0) return res;
    if (res["lack_poster_credit"] = myposter_count >= poster_credit) return res;
    return res;
  }
}

export default PublishModule

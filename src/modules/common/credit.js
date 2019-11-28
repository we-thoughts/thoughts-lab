// 引入服务模块
import * as ServerServices from '../../data/ifanr-server'
// 引入配置文件
import { AppConfigurations } from "../../basic";

const { max_poster_credit } = AppConfigurations.getConfigByPath("modules/common/credit");
let { credit: CreditService } = ServerServices.common

let GlobalStorage = null

class CreditModule {
  constructor(storage) {
    GlobalStorage = storage
  }
  storage_fieldname = "credit_info"

  setCreditInfo(credit_info) {
    GlobalStorage.setData(this.storage_fieldname, credit_info)
  }

  async getCreditInfo(options = { fresh: false }) {
    let { fresh } = options

    // 防止首次以 { fresh: false } 调用
    if ((Object.keys(GlobalStorage.getData(this.storage_fieldname)).length === 0) && !fresh) {
      return this.getCreditInfo({ fresh: true })
    }

    if (fresh) {
      await this.requestCreditInfo()
    }

    return GlobalStorage.getData(this.storage_fieldname)
  }

  async requestCreditInfo() {
    await CreditService.requestCreditInfoByOpenid(await GlobalStorage.getData('openid')).then(credit_info => {
      this.setCreditInfo(credit_info)
    }, err => {
      throw new Error(err)
    })
  }

  async canCreditUpdated() {
    let poster_credit = GlobalStorage.getData(this.storage_fieldname)["poster_credit"];
    if (poster_credit === undefined) {
      await this.requestCreditInfo()
      poster_credit = GlobalStorage.getData(this.storage_fieldname)["poster_credit"];
    }
    return poster_credit ? poster_credit < max_poster_credit : true;
  }

  async checkStaticCredit(data) {
    data['openid'] = GlobalStorage.getData('openid');
    await CreditService.checkStaticCredit(data)
  }
}
export default CreditModule

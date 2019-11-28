import { AppConfigurations } from '../../../basic';

const { TABLE_NAMES } = AppConfigurations.getConfigByPath("services/ifanr-server/common/credit");

class CreditService {
  constructor() { }

  requestCreditInfoByOpenid(openid) {
    return new Promise((resolve, reject) => {
      let query = new wx.BaaS.Query().compare('openid', '=', openid)
      let CreditTable = new wx.BaaS.TableObject(TABLE_NAMES.credit)
      CreditTable.setQuery(query).find().then(res => {
        if (res.data.objects.length === 1) {
          resolve(res.data.objects[0])
        } else if (res.data.objects.length === 0) {
          // 若没有找到目标条目，就先创建一个新的（初始化）条目并返回
          this._createCreditRecord(openid).then(res => {
            resolve(res.data)
          })
        } else {
          reject(new Error('目标数据条目不唯一！'))
        }
      }, err => {
        reject(err)
      }).catch(err => {
        return new Error(err)
      })
    })
  }

  _createCreditRecord(openid) {
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(TABLE_NAMES.credit)
        .create()
        .set("openid", openid)
        .save()
        .then((res) => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  checkStaticCredit(data) {
    return new Promise((resolve, reject) => {
      wx.BaaS.invokeFunction('checkStaticCredit', data).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }
}

let SingleCreditService = new CreditService()

export default SingleCreditService

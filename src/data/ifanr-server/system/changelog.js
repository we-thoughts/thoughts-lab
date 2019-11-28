import { AppConfigurations } from '../../../basic';

const { TABLE_NAMES, REQUSET_PARAMS } = AppConfigurations.getConfigByPath("services/ifanr-server/system/changelog");

class ChangelogService {
  constructor() { }
  requestChangelogs() {
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(TABLE_NAMES.changelog)
        .limit(REQUSET_PARAMS['posters_limit'])
        .offset(REQUSET_PARAMS['posters_offset'])
        .orderBy(REQUSET_PARAMS['default_order_by'])
        .find()
        .then(res => {
          resolve(res.data.objects)
        }, err => {
          reject(err)
        })
    })
  }
}

let SingleChangelogService = new ChangelogService()

export default SingleChangelogService

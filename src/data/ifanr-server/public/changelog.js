const OPTION = {
  TABLE_NAMES: "ChangelogTable",
  REQUSET_PARAMS: {
    posters_limit: 1000,
    posters_offset: 0,
    default_order_by: ['-created_at']
  }
};

class ChangelogService {
  constructor() { }
  requestChangelogs(option = OPTION) {
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(option["TABLE_NAMES"])
        .limit(option["REQUSET_PARAMS"]['posters_limit'])
        .offset(option["REQUSET_PARAMS"]['posters_offset'])
        .orderBy(option["REQUSET_PARAMS"]['default_order_by'])
        .find()
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }
}

let SingleChangelogService = new ChangelogService()

export default SingleChangelogService

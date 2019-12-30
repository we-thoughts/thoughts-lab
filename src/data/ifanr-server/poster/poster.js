const OPTION = {
  poster: {
    TABLE_NAMES: "PosterTable",
    REQUSET_PARAMS: {
      posters_limit: 10,
      posters_offset: 0,
      older_posters_limit: 10,
      default_order_by: ['-created_at'] // 降序
    }
  }
};

class PosterService {
  constructor() { }

  requestPosters(option = OPTION) {
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(option["TABLE_NAMES"])
        .limit(option["REQUSET_PARAMS"]["posters_limit"])
        .offset(option["REQUSET_PARAMS"]["posters_offset"])
        .orderBy(option["REQUSET_PARAMS"]["default_order_by"])
        .find()
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  requestNewerPosters(basedate, option = OPTION) {
    let query = new wx.BaaS.Query().compare('created_at', '>', basedate)
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(option["TABLE_NAMES"])
        .setQuery(query)
        .orderBy(option["REQUSET_PARAMS"]["default_order_by"])
        .find()
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  requestOlderPosters(basedate, option = OPTION) {
    let query = new wx.BaaS.Query().compare('created_at', '<', basedate)
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(option["TABLE_NAMES"])
        .setQuery(query)
        .limit(option["REQUSET_PARAMS"]["older_posters_limit"])
        .orderBy(option["REQUSET_PARAMS"]["default_order_by"])
        .find()
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  requestPostersByUserId(userid, option = OPTION) {
    let query = new wx.BaaS.Query().compare('created_by', '=', userid)
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(option["TABLE_NAMES"])
        .setQuery(query)
        .orderBy(option["REQUSET_PARAMS"]["default_order_by"])
        .find()
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  createPoster(poster_data, option = OPTION) {
    console.info(option)
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(option["TABLE_NAMES"])
        .create()
        .set(poster_data)
        .save()
        .then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  deletePosterById(id, option = OPTION) {
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(option["TABLE_NAMES"])
        .delete(id).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }
}

let SinglePosterService = new PosterService()

export default SinglePosterService

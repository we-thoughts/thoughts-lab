import { AppConfigurations } from '../../../basic'

const { TABLE_NAMES, REQUSET_PARAMS } = AppConfigurations.getConfigByPath("services/ifanr-server/poster/poster");

class PosterService {
  constructor() { }

  requestPosters() {
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(TABLE_NAMES.poster)
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

  requestNewPosters(basedate) {
    let query = new wx.BaaS.Query().compare('created_at', '>', basedate)
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(TABLE_NAMES.poster)
        .setQuery(query)
        .orderBy(REQUSET_PARAMS['default_order_by'])
        .find()
        .then(res => {
          resolve(res.data.objects)
        }, err => {
          reject(err)
        })
    })
  }

  requestOlderPosters(basedate) {
    let query = new wx.BaaS.Query().compare('created_at', '<', basedate)
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(TABLE_NAMES.poster)
        .setQuery(query)
        .limit(REQUSET_PARAMS['older_posters_limit'])
        .orderBy(REQUSET_PARAMS['default_order_by'])
        .find()
        .then(res => {
          resolve(res.data.objects)
        }, err => {
          reject(err)
        })
    })
  }

  requestPostersByUserId(userid) {
    let query = new wx.BaaS.Query().compare('created_by', '=', userid)
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(TABLE_NAMES.poster)
        .setQuery(query)
        .orderBy(REQUSET_PARAMS['default_order_by'])
        .find()
        .then(res => {
          resolve(res.data.objects)
        }, err => {
          reject(err)
        })
    })
  }

  async createPoster(poster_data) {
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(TABLE_NAMES.poster)
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

  async deletePosterById(id) {
    return new Promise((resolve, reject) => {
      new wx.BaaS.TableObject(TABLE_NAMES.poster)
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

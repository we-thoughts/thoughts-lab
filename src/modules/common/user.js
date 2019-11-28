import * as ServerServices from '../../data/ifanr-server'

let { user: UserService } = ServerServices.common

let GlobalStorage = null

class UserModule {
  constructor(storage) {
    GlobalStorage = storage
  }
  storage_fieldname = "user_info"
  setUserInfo(user_info) {
    GlobalStorage.setData(this.storage_fieldname, user_info)
  }

  async getUserInfo(options = { fresh: false }) {
    let { fresh } = options

    // 防止首次以 {fresh:false} 调用
    if ((Object.keys(GlobalStorage.getData(this.storage_fieldname)).length === 0) && !fresh) {
      return this.getUserInfo({ fresh: true })
    }

    if (fresh) {
      await UserService.getUserInfo().then(user_info => {
        this.setUserInfo(user_info)
      }, err => {
        throw new Error(err)
      })
    }

    return GlobalStorage.getData(this.storage_fieldname)
  }

}

export default UserModule

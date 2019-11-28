
class UserService {
  constructor() {}
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.BaaS.auth.getCurrentUser().then(userInfo => {
        resolve(userInfo)
      }).catch(err => {
        if (err.code === 604) {
          console.log('用户未登录')
        }
        reject(err)
      })
    })
  }
}

let SingleUserService = new UserService()

export default SingleUserService

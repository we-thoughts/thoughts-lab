
class UserService {
  constructor() { }

  getUser() {
    return new Promise((resolve, reject) => {
      wx.BaaS.auth.getCurrentUser().then(userinfo => {
        resolve(userinfo)
      }).catch(err => {
        if (err.code === 604) {
          console.log('用户未登录')
        }
        reject(err)
      })
    })
  }

  setEmail(data) {
    return new Promise((resolve, reject) => {
      let { email, sendVerificationEmail } = data;
      wx.BaaS.auth.getCurrentUser()
        .then(user => {
          return user.setEmail(email, { sendVerificationEmail })
        })
        .then(user => {
          resolve(user)
        }).catch(err => {
          reject(err)
        })
    })
  }
}

let SingleUserService = new UserService()

export default SingleUserService

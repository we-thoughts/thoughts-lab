
class LoginService {
  constructor() { }
  login() {
    return new Promise((resolve, reject) => {
      // 微信静默登录-----
      wx.BaaS.auth.loginWithWechat(null, { createUser: true }).then(user => {
        console.info("LoginService loginWithWechat")
        resolve(user)
      }, err => {
        reject(err)
      })
    })
  }
}

let SingleLoginService = new LoginService()

export default SingleLoginService


class LoginService {
  constructor() { }
  login() {
    return new Promise((resolve, reject) => {
      // 微信静默登录-----
      wx.BaaS.auth.loginWithWechat(null, { createUser: true }).then(userinfo => {
        console.info("LoginService loginWithWechat")
        resolve(userinfo)
      }, err => {
        reject(err)
      })
    })
  }
}

let SingleLoginService = new LoginService()

export default SingleLoginService


class WxServerServices {
  constructor() { }
  fetchConfig() {
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database();
      db.collection("configurations").where({
        tag: "latest"
      }).get({
        success: (res) => {
          resolve(res)
        },
        fail: (res) => {
          reject(res)
        }
      })
    })
  }

  getAccessToken() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'get-access_token',
        data: {},
        // 成功回调
        complete: (res) => {
          resolve(res)
        }
      })
    })
  }

  msgSecCheck({ content }) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'check-message_security',
        data: { content },
        complete: (res) => {
          resolve(res)
        }
      })
    })
  }
}

let SingleWxServerServices = new WxServerServices()

// SingleWxServerServices.getAccessToken().then(res => {
//   console.info(`curl -d '{ "content":"hello world!" }' 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${res.result}'`)
//   console.info(`curl -d '{ "content":"完2347全dfji试3726测asad感3847知qwez到" }' 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${res.result}'`)
// })

// SingleWxServerServices.msgSecCheck({ content: "完2347全dfji试3726测asad感3847知qwez到" }).then(res => { console.info(res) })
// SingleWxServerServices.msgSecCheck({ content: "hello world!" }).then(res => { console.info(res) })

export default SingleWxServerServices;

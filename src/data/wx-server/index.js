// 小程序云能力初始化
wx.cloud.init({
  env: "development-d7xlq",
  traceUser: true
});

let Services = {
  fetchConfig() {
    return new Promise((resolve, reject) => {
      const db = wx.cloud.database();
      db.collection("configurations").where({
        tag: "latest"
      }).get({
        success: (res) => {
          resolve(res.data[0])
        },
        fail: (res) => {
          reject(res)
        }
      })
    })
  }
}

export default Services

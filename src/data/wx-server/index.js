let Services = {
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
}

export default Services

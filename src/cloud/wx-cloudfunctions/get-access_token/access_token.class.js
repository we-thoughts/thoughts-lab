// 以下代码参考：
// 版权声明：本文为CSDN博主「老何的博客」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/haitaoxiaodian/article/details/90762835

const cloud = require('wx-server-sdk');
const request = require('request');

class AccessToken {
  constructor({ app_id, app_secret }) {
    this.appid = app_id;
    this.secret = app_secret;
  }

  // 获取 access_token
  async getAccessToken() {
    let token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appid}&secret=${this.secret}`;
    const rp = options =>
      new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) {
            reject(error);
          }
          resolve(response);
        });
      });
    const result = await rp({
      url: token_url,
      method: 'GET'
    });
    return (typeof result.body === 'object') ? result.body : JSON.parse(result.body);
  }

  async getCacheToken() {
    let collection = 'access_token';//数据库集合名称
    let gapTime = 1800000; // 5 分钟
    cloud.init();
    let db = cloud.database();
    let result = await db.collection(collection).get();
    if (result.code) {
      return null;
    }
    // 数据库没有，获取
    if (!result.data.length) {
      let accessTokenBody = await this.getAccessToken();
      let act = accessTokenBody.access_token;
      let ein = accessTokenBody.expires_in * 1000;
      await db.collection(collection).add({
        data: {
          _id: 1,
          accessToken: act,
          expiresIn: ein,
          createTime: Date.now()
        }
      });
      return act;
    } else {
      let data = result.data[0];
      let {
        _id,
        accessToken,
        expiresIn,
        createTime
      } = data;
      // 判断access_token是否有效
      if (Date.now() < createTime + expiresIn - gapTime) {
        return accessToken;
      }
      // 失效，重新获取
      else {
        let accessTokenBody = await this.getAccessToken();
        let act = accessTokenBody.access_token;
        let ein = accessTokenBody.expires_in * 1000;
        await db.collection(collection).doc(_id).set({
          data: {
            accessToken: act,
            expiresIn: ein,
            createTime: Date.now()
          }
        });
        return accessTokenBody.access_token;
      }
    }
  }
}
module.exports = AccessToken;

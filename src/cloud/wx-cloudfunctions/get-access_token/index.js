// 云函数入口文件
const cloud = require('wx-server-sdk');
const AccessToken = require('access_token.class'); //引入AccessToken类
const secret = require('secret');

cloud.init()

let { app_id, app_secret } = secret;
console.info(app_id, app_secret);
// 云函数入口函数
exports.main = async (event, context) => {
  let AccessTokenInstance = new AccessToken({
    app_id,
    app_secret
  });
  return AccessTokenInstance.getCacheToken();
};

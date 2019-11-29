import { from } from 'rxjs';
// 引入服务模块
import * as IfanrServerData from '../../data/ifanr-server';

let CreditData = IfanrServerData.common.credit;
let UserData = IfanrServerData.common.user;

class SystemRepository {
  constructor() { }

  getUserInfo() {
    return from(UserData.getUserInfo());
  }

  getCreditInfoByOpenid(openid) {
    openid = openid || "oF8As5A2vdJBM0WmWNetFkSAU7EI";
    console.log(openid)
    return from(CreditData.requestCreditInfoByOpenid(openid));
  }

}

let SingleSystemRepository = new SystemRepository();

export default SingleSystemRepository;

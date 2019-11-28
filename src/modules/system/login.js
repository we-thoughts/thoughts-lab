import * as ServerServices from '../../data/ifanr-server'
import * as CommonModules from '../common'

let { login: LoginService } = ServerServices.system;
let { user: CommonUser } = CommonModules;

let GlobalStorage = null;

class LoginModule {
  constructor(storage) {
    GlobalStorage = storage;
  }
  _initializeData(name, value) {
    console.log(`【initializeData】: ${name} = ${value}`)
    GlobalStorage.setData(name, value)
  }
  async login() {
    let user_info = await LoginService.login();
    CommonUser.setUserInfo(user_info);
    this._initializeData('openid', user_info.openid)
  }
}

export default LoginModule

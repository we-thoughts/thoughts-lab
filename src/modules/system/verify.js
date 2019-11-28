import * as CommonModules from '../common';

let { user: CommonUser, credit: CommonCredit } = CommonModules;

let GlobalStorage = null;

class VerifyModule {
  constructor(storage) {
    GlobalStorage = storage
  }

  async checkStaticCredit() {
    let { _email, _email_verified } = await CommonUser.getUserInfo({ fresh: false });
    await CommonCredit.checkStaticCredit({
      _email,
      _email_verified
    })
  }

  async getUserInfo(options = { fresh: false }) {
    return await CommonUser.getUserInfo(options)
  }

  async getCreditInfo(options = { fresh: false }) {
    return await CommonCredit.getCreditInfo(options)
  }
}

export default VerifyModule

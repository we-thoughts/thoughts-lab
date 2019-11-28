import * as CommonModules from '../common'

let { credit: CommonCredit, user: CommonUser } = CommonModules

let GlobalStorage = null

class ProfileModule {
  constructor(storage) {
    GlobalStorage = storage
  }

  canCreditUpdated() {
    return CommonCredit.canCreditUpdated()
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

export default ProfileModule

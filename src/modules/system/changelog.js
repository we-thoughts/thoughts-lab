import * as ServerServices from '../../data/ifanr-server'

let { changelog: ChangelogService } = ServerServices.system;

let GlobalStorage = null;

class ChangelogModule {
  constructor(storage) {
    GlobalStorage = storage;
  }
  storage_fieldname = "changelogs"
  setChangelogs(changelogs) {
    GlobalStorage.setData(this.storage_fieldname, changelogs)
  }
  async getChangelogs(options = { fresh: true }) {
    let { fresh } = options

    // 防止首次以 { fresh: false } 调用
    if ((GlobalStorage.getData(this.storage_fieldname).length === 0) && !fresh) {
      return this.getChangelogs({ fresh: true })
    }

    if (fresh) {
      await ChangelogService.requestChangelogs().then(changelogs => {
        this.setChangelogs(changelogs)
      }, err => {
        throw new Error(err)
      })
    }

    return GlobalStorage.getData(this.storage_fieldname)
  }
}

export default ChangelogModule

import * as ServerServices from '../../data/ifanr-server';
import * as CommonModules from '../common';

let { file: FileService } = ServerServices.common;
let { poster: PosterService } = ServerServices.poster;
let { user: CommonUser } = CommonModules;

let GlobalStorage = null;

class MyPosterModule {

  constructor(storage) {
    GlobalStorage = storage
  }
  storage_fieldname = "myposters"
  setMyPosters(posters) {
    GlobalStorage.setData(this.storage_fieldname, [].concat(posters))
  }

  async getMyPosterById(id, options = { fresh: true }) {
    let posters = []
    if (options.fresh === true) {
      posters.concat(await this.getMyPosters({ fresh: true }))
    }
    posters = await this.getMyPosters({ fresh: false })
    for (let poster of posters) {
      if (poster.id === id) {
        return poster
      }
    }
    throw new Error('未找到目标 Poster')
  }

  async getMyPosters(options = { fresh: true }) {
    if (
      (options.fresh === false && GlobalStorage.getData(this.storage_fieldname).length === 0)
      || options.fresh === true
    ) {
      this.setMyPosters(await PosterService.requestPostersByUserId((await CommonUser.getUserInfo({ fresh: false })).id))
    }
    return GlobalStorage.getData(this.storage_fieldname)
  }

  async deleteMyPosterById(id, callback) {
    let poster = await this.getMyPosterById(id, { fresh: false })
    if (!poster) return new Error('未找到要删除的 poster')

    let pic_ids = []
    for (let pic of poster.pictures) {
      pic_ids.push(pic.id)
    }

    return FileService.deleteFiles(pic_ids)
      .then(res => {
        return PosterService.deletePosterById(id)
      }, err => {
        return new Error('删除失败')
      })
  }

  removePosterById(id) {
    let posters = GlobalStorage.getData(this.storage_fieldname)
    let new_posters = []
    for (let i = 0, len = posters.length; i < len; i++) {
      if (posters[i].id === id) continue
      new_posters.push(posters[i])
    }
    this.setMyPosters(new_posters)
  }

  revisePosterChanged(changed_payloads) {
    let res = {
      has_new_poster: false,
      has_poster_changed: false
    };
    if (changed_payloads.length === 0) return res;
    for (let payload of changed_payloads) {
      if (payload.change_type === "add") {
        res.has_new_poster = true;
      }
      if (payload.change_type === "delete") {
        res.has_poster_changed = true;
        this.removePosterById(payload.id);
      }
    }
    return res;
  }
}

export default MyPosterModule

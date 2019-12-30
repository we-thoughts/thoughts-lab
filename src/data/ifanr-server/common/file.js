const OPTION = {
  category: "poster_picture",
  PUBLISH_OPT: {
    picture_category_name: "poster_picture"
  }
}

class FileService {
  constructor() { }
  async uploadFiles(files, option = OPTION) {
    let res = [];
    for (let file of files) {
      let _res = await new wx.BaaS.File().upload({ filePath: file }, { categoryName: option.category })
      if (_res.statusCode === 200) {
        res.push(_res)
      }
    }
    return res;
  }

  deleteFiles(files) {
    return new Promise((resolve, reject) => {
      new wx.BaaS.File().delete(files).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }
}

let SingleFileService = new FileService()

export default SingleFileService

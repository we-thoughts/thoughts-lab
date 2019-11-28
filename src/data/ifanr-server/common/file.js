class FileService {
  constructor() { }
  async uploadFiles(files, category) {
    let res = []
    for (let file of files) {
      let _res = await new wx.BaaS.File().upload({ filePath: file }, { categoryName: category })
      if (_res.statusCode === 200) {
        res.push(_res.data.file)
      } else {
        return res
      }
    }
    return res
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

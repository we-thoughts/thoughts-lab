class Storage {
  constructor() { }

  data = {}

  init(data) {
    // TODO: 格式校验和深复制
    this.data = data
    return this
  }

  use(name) {
    if (!this.data[name]) {
      this.data[name] = new Storage();
    }
    return this.data[name];
  }

  setData(name, value) {
    return this.data[name] = value
  }

  getData(name) {
    // TODO: 优化读取本地缓存的逻辑
    return this.data[name]
  }
}

export default Storage

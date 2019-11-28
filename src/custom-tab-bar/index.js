Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    iconfont_familyname: "mobius-iconfont",
    iconfont_classname_prefix: "mobius-iconfont__",
    _defaultPath: "",
    _toPath: "",
    selectedPath: "",
    color: "#000",
    selectedColor: "#07C160",
    list: [
      {
        "pagePath": "pages/poster/poster/poster",
        "selectediconFontName": "",
        "iconFontName": "discover",
        "text": "列表"
      },
      {
        "pagePath": "pages/poster/myposter/myposter",
        "iconFontName": "square-add",
        "text": "发布"
      },
      {
        "pagePath": "pages/system/profile/profile",
        "iconFontName": "me",
        "text": "个人"
      }
    ]
  },
  observers: {
    _toPath(path) {
      this.setTabTo(path);
    }
  },
  lifetimes: {
    attached() { },
    detached() {
      // tabbar 组件疑似创建之后就不会被移除，猜测其与页面路径绑定
    }
  },
  pageLifetimes: {
    show: function () {
      console.info("component pagelifetimes show trigger!")
      // 页面被展示
    }
  },
  methods: {
    setTabTo(path) {
      if (!this.data._defaultPath) this.setData({ _defaultPath: path });
      this.setData({
        selectedPath: path
      })
    },
    switchTabTo(path) {
      wx.switchTab({ url: "/" + path })
    },
    switchTab(e) {
      const { path } = e.currentTarget.dataset;
      this.switchTabTo(path)
    }
  }
})

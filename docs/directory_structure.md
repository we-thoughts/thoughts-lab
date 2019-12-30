## Directory Structure

```
./
├── attachment/                         Thoughts Lab 项目附件目录
├── build/                              Thoughts Lab 构建工具目录
├── dist                                分发目录
│   ├── build/
│   └── dev/
├── docs/                               Thoughts Lab 项目文档目录
├── public/                             Thoughts Lab 项目展示页面
├── src                                 Thoughts Lab 核心代码
│   ├── basic/                          Thoughts Lab 配置和环境文件目录
│   ├── cloud                           云函数本地目录
│   │   └── wx-cloudfunctions/          微信云函数本地目录
│   ├── common                          公共目录
│   │   └── utils/                      公共工具函数目录
│   ├── components/                     uni-app 组件目录
│   ├── css                             Thoughts Lab 样式目录
│   │   ├── colorui/
│   │   ├── mobius/
│   │   └── weui/
│   ├── data                            Thoughts Lab 架构 Data 层目录
│   │   ├── ifanr-server/
│   │   ├── local-storage/
│   │   ├── storage/
│   │   └── wx-server/
│   ├── domain                          Thoughts Lab 架构 Domain 层目录
│   │   ├── poster/
│   │   ├── public/
│   │   └── system/
│   ├── entities/                       Thoughts Lab 架构 Entities 目录
│   ├── hybrid/                         uni-app 存放本地网页的目录
│   ├── libs                            Thoughts Lab 存放第三方库的目录
│   │   └── mobius/
│   ├── modules/                        Thoughts Lab 模块目录
│   ├── pages                           业务页面文件存放的目录
│   │   ├── index/
│   │   ├── ...
│   │   └── public/
│   ├── platforms/                      uni-app 存放各平台专用页面的目录
│   ├── presenter                       Thoughts Lab 架构 Presenter 目录
│   │   ├── index/
│   │   ├── ...
│   │   └── public/
│   ├── services/                       Thoughts Lab 结构 Services 目录
│   ├── static/                         uni-app 存放应用引用静态资源（如图片、视频等）的目录
│   ├── wxcomponents                    uni-app 存放多端小程序组件的目录
│   │   ├── custom-tab-bar/             微信小程序自定义 TabBar
│   │   └── iconfont/
│   ├─App.vue                           应用配置，用来配置 App 全局样式以及监听应用生命周期
│   ├─main.js                           Vue 初始化入口文件
│   ├─manifest.json                     配置应用名称、appid、logo、版本等打包信息
│   ├─pages.json                        配置页面路由、导航条、选项卡等页面类信息
│   └─template.h5.html
├─ .gitignore                           gitignore
├─ LICENSE                              GPL 3.0 开源许可
├─ iconfont.json                        微信小程序有色图标组件配置文件
├─ README.md                            项目介绍
└─ vue.config.js                        Thoughts Lab 在 uni-app 的构建配置文件
```

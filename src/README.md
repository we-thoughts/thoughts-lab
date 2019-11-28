
# README

## TODO

- [ ] 重构 AOP
  - [ ] page 高阶实现
- [ ] 开发计划投票功能
- [ ] <tabbar> 组件增强
  - [ ] 下拉加载动态样式
- [ ] <scrolllist> 组件增强
  - [ ] 内置下拉刷新
  - [ ] 开放设置滚动位置的接口（顶部、底部）
  - [ ] 开放内置使用状态机实现的“加载更多”接口
  - [ ] 空列表占位背景
- [ ] 支持关键词搜索 Poster
- [ ] 网关接机器人
- [ ] <timeline> 组件
- [ ] <timeline-item> 更新类型定义及呈现实现补充
- [ ] 样式代码统一优化

- [ ] Publish 草稿箱
- [ ] 启动时集中获取系统信息及屏幕布局信息

- [ ] 修复【publish】页面在无 poster_credit 的情况下不显示图片选择器的问题
- [ ] 【profile】页面吐个槽 ID 提取为配置项

## DOING

### 0.7.4 update

#### 细节

- [x] 【publish】页面交互优化
  - [x] 发送成功之后的提示（再编辑 Or 返回上一页）
- [x] 【myposter】页面优化
  - [x] 添加列表标题
- [x] 【verify】页面优化
  - [x] 添加 loading 状态的提示

#### 发布

- [x] “发布”页面添加列表标题
- [x] “发布编辑”页面提交成功之后自动返回上一页
- [x] 为邮箱验证页面添加冷却时提示

## DONE

### 0.7.1 bugfix

#### 细节

- [x] 【profile】页面：await 以避免同时造成两次“首次 Credit 请求”导致的条目冲突问题

#### 发布

- [x] 暂时修复“个人”页面加载时的 Credit 数据请求冲突问题

### 0.7.0 update

#### 细节

- [x] 【myposter】提为发布功能主体页面，原【publish】页面内容编辑表单层级下调
  - [x] 【myposter】 将 myposter.length 传递给 【publish】
- [x] 实现【verify】页面及相应逻辑
  - [x] loading 计数机制重写
  - [x] loading 状态下锁定操作
- [x] 优化 poster_credit 的刷新机制以减少冗余请求
  - [x] 移除启动时触发 creditCheck
  - [x] 【profile】页面添加点击触发请求操作，操作之间有数十秒冻结期
- [x] 配置热更新：应用配置统一提取至云端，本地留存限时副本
  - [x] 优化配置项提取
  - [x] 接入腾讯云开发
- [x] Poster 应用级模块整合
  - [x] 单独提取 Poster 应用管理模块
  - [x] Store 页面级粒度模块化管理
  - [x] 模块目录整合

#### 发布

- [x] 拆分“poster 内容编辑”和“我的 posters”为两个页面
- [x] 实现邮箱验证页面及功能，仅支持 CUC 邮箱验证
- [x] 优化“发布点数”的刷新机制：新机制可有效减少冗余请求
- [x] 配置热更新：将必要的应用配置统一提取至云端，支持在不发版的情况下更新应用
- [x] Poster 应用级模块整合：提取 Poster、System 等应用管理模块，全局状态管理 Store 粒度下沉至页面，项目目录结构调整与优化

### 0.6.4 update

#### 细节

- [x] <tagbar> 组件增强
  - [x] 定位优化，自动计算 paddingX
  - [x] 工具函数提取
- [x] <scrolllist> 组件增强：内容较少时的点击加载事件
- [x] 实现 <timeline-item> 更新类型区别呈现
  - [x] update
  - [x] bugfix
- [x] 统一提取 loadsh 工具函数为单独模块

#### 发布

- [x] <tagbar> 组件增强：定位优化、工具函数提取
- [x] <scrolllist> 组件增强：内容较少时的点击加载事件
- [x] <timeline> 组件增强：更新类型区别呈现
- [x] 统一提取 loadsh 工具函数为单独模块

### 0.6.0 update

#### 细节

- [x] <tagbar> 组件开发
- [x] 支持分类查看 posters
- [x] CSS BEM 化
  - [x] 命名
  - [x] 文件目录优化
  - [x] 变量提取

#### 发布

- [x] <tagbar> 组件开发：支持分类查看 posters
- [x] CSS BEM 化：命名、变量提取、目录优化

### 0.5.1 update

#### 细节

- [x] 优化 <navbar> 尺寸及定位算法

#### 发布

- [x] 优化 <navbar> 尺寸及定位算法

### 0.5.0 update

#### 细节

- [x] <pagelayout> 组件开发
- [x] <wxcapsule> 组件开发
  - [x] 胶囊逻辑实现
- [x] <navbar> 组件开发
  - [x] 设置 title 的默认值，从 page.route 中提取
  - [x] title 样式调整
  - [x] 双击事件实现
- [x] <scrolllist> 组件开发
- [x] <loadmore> 组件重写

#### 发布

- [x] <pagelayout> 组件开发：统一三段式布局
- [x] <wxcapsule> 组件开发：极致接近微信原生胶囊的组件
- [x] <navbar> 组件开发
- [x] <scrolllist> 组件开发
- [x] <loadmore> 组件重写

### 0.4.4 update

#### 细节

- [x] 优化 UI：添加刷新、提交等操作的加载态 UI 提示
- [x] poster 类别梳理，目前分为 7 大类以及其它

#### 发布

- [x] 优化 UI：添加刷新、提交等操作的加载态 UI 提示
- [x] poster 类别梳理，目前分为 7 大类以及其它

### 0.4.2 bugfix

#### 细节

- [x] 修复 previewImage 组件的 BUG
  - [x] 官方组件可用性差，搁置修复，暂时换为 API 实现
- [x] 发布页删除之后列表页移除 BUG

#### 发布

- [x] 修复 <previewImage> 组件被原生组件遮挡的的 BUG
- [x] 修复在发布页进行多次“删除”与“添加”之后列表页非全量更新的 BUG

### 0.4.0 update

#### 细节

- [x] 完成【changelog】页面
  - [x] 提取 <timeline-item> 组件
    - [x] 提取 item 的 icon 样式
- [x] 提取 utils 模块
  - [x] 时间格式处理模块
- [x] 接入【吐个槽】社区
  - [ ] 登录态
- [x] 配置智能客服
  - [ ] 配置上线

#### 发布

- [x] 完成【开发日志】页面：抽离 <timeline-item> 组件
- [x] 提取 "utils" 时间格式处理模块
- [x] 接入【吐个槽】社区
- [x] 配置智能客服：目前是人工客服

### 0.3.0 update

#### 细节

- [x] 抽离应用配置为单独服务
  - 数据表字段
  - poster 拉取参数 (limit, offset...)
- [x] 应用程序逻辑优化
  - GlobalStore 与 Vuex 使用情况的划分
  - 变量及模块耦合关系的梳理
- [x] 自定义 tabbar，引入 AOP
  - [x] 实现
  - [x] 优化 tabbar
    - 在 switchtab 之前改变目标 tab 的选中状态
  - [x] 优化 AOP

#### 发布

- [x] 抽离应用配置为单独服务：数据表字段、poster 拉取参数等
- [x] 自定义 <tabbar>  组件，引入 AOP 处理共有的页面逻辑

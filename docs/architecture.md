[TOC]

# Thoughts Lab Architecture

Thoughts Lab 以同名微信小程序的面貌为大家所知，但需要跟开发者们说的是，微信小程序只不过是它的一种发布形式而已。这个项目经过两次比较大的重构，重构的原因只有一条：**尽可能降低对第三方的依赖性，无论是最终的发布平台还是产品的代码选型、实现**。

所以，Thoughts Lab 基本具备以下特点：

- 发布平台无关，可以以最低的变更成本实现多端发布，包括：各家小程序、Web、App；
- 开发框架无关，可以以最低的变更成本实现开发框架（MINA、Taro、Omi，以及 Vue、Angular、React……）的迁移；
- 云服务提供商无关，可以以最低的变更成本实现服务商替换与迁移；

> 虽然 Thoughts Lab 目前还是雏形阶段，但它已经大抵具备了以上特点，随着开发工作的持续推进，以上特性会更加清晰完善。

具体来讲，各个部分的方案选择主要取决于我对这款产品的发布场景预期。众所周知，**Thoughts Lab 基本是一款功能性工具的集合**，我希望它一定是**用完即走**的，它应该成为用户解决特定问题最好的选择，而不应该具有任何的黏性。为了达成上述目标，它最好能够融入现有的生态中，小程序是一个非常好的场景，这个端将获得**首要的支持**，其中微信小程序是最优先的。

同时，出于个人对技术发展趋势的考虑，我也不希望它失去任何在 Web 端发布应当具有的能力，它应该可以无损地发布为 Web App，在长期的开发计划中，支持 Mobile Web App 的发布是位于新功能的开发之后的**优先级第二**的目标，完成之后我将第一时间将其内嵌到 Thoughts Daily 服务号中，这也是**为许多不具备小程序发布资质的朋友降低部署门槛**。

至于 App 端，则需要依赖开发框架的选择，好在 Thoughts Lab 切换框架的成本极低。在兼容性方面，因为我没有做过移动端 App 的开发工作，所以目前无法预计，但可以肯定的是如果应用没有用到某一平台（小程序、浏览器）的特殊能力的话，绝大多数功能是可以成功迁移的。需要说明的是， App 在可见的未来不会成为优先支持的发布端。

以下我会分四个方面来详细介绍 Thoughts Lab 的技术选型实践，分别是呈现、框架、开发、服务。

## 框架（Framework）

>  呈现方案与框架有一定程度的耦合，所以先介绍框架的选择。

小程序官方非常努力，原生框架 MINA 一直在大步更新和拓展，开发者社区也十分活跃。但我在开发完几个练手的应用之后觉得官方框架也许更适合没有前端开发经验的伙伴们使用，或者用于开发一些保持轻量且不打算跨端扩展的应用。当目标应用体量较大时，必然考虑到 UI 和业务逻辑的复用和迁移成本，这种场景下我**绝对**不会使用原生框架（哪怕是社区中已经存在了小程序转其它端的工具）。

最初 Thoughts Lab 是基于 Omi 写的，当时选择 Omi 是看中了官方宣扬的 Web Components 的特性，加上是 Tencent 背景，想来应该不差。深入使用后诸多麻烦逐步显现出来，遇到最大的问题是 Omi 的实现理念与我的实现目标（尽可能降低对第三方的依赖）完全不符，当然也有不少功能实现上的麻烦，但 Omi 之后经过几番更新，我不好多说，此处略过不表。

还有关于 Taro（我最初采用的 Omip 基于 Taro）、WePY、mpvue 暂不再赘述，几番权衡之后决定使用 uni-app 重写，主要原因有两点：

- uni-app 基于 Vue 实现且特性支持完善，我也可以尽可能避免 All in JS（我真的超级讨厌，这也是弃用 Omi 的原因之一）；
  - 使用 uni-app 开发也意味着我完全可以在其它基于 Vue 的 Web App 中直接复用组件和 UI；
- uni-app 提供了完善的跨端发布方案，支持发布为微信、支付宝、百度、头条、QQ小程序，以及 Web App 和 Android、iOS。
  - uni-app 支持多端的方式之一是提供基于注释实现的“条件编译”功能，属于目前我最为心仪的跨端实现方案。

> 其实我并不是 Vue 的资深开发者，但单纯从我对框架的要求来说的话，uni-app 还没有让我失望，**我不希望在我明明有更优的实现方案的时候由于框架的限制不得不妥协，我几乎不在任何实现上做妥协**，题外话，我非常欣赏 Vue 折衷的设计哲学，uni-app 同样也做到了，它们在最大程度上保障了我开发的可能性。
>

## 呈现（UI）

框架采用了 uni-app，UI 自然是基于 Vue 写的。在此之上，UI 部分的关注点有二：

- 样式方案的选择；
- 组件逻辑跨框架复用；

> 自带功能实现的组件库于我不适用，所以此处将样式和组件功能实现分开讨论。

首先是样式方案，我一直坚信，**选择生态的同时也意味着要担负起维护生态的责任**，由于 Thoughts Lab 当前会优先保障在微信中使用的体验，为了不让用户在微信主程序和小程序之间有“异物感”，我决定在 UI 和交互方面尽可能模拟微信的观感和体验。

微信官方提供了详细的 [设计规范](https://developers.weixin.qq.com/miniprogram/design/) 和 [WeUI](https://weui.io/) 框架可供参考，但是组件的类目较少，并不能够满足所有的呈现需求。[ColorUI](https://www.color-ui.com/) 是一套非常养眼的组件库，并且包含了卡片、聊天界面、时间轴、索引列表和垂直导航等复杂组件。Thoughts Lab 的 UI 是在 WeUI 和 ColorUI 之上建构的，初始开发阶段直接引用，之后考虑到定制和风格统一的问题，决定自行实现一套，叫做 `Mobius UI`。

- 将会内置多款主题，包括但不限于：一套官方风格、微信风格、支付宝风格等，发布至不同平台的时候，可以采用不同的主题，保证与平台的一致性；

当前项目使用的样式是在 WeUI 和 ColorUI 的重新实现，位于 `css > mobius` 目录下。这套方案目前只是小样，仅能满足 Thoughts Lab MVP 阶段的使用，在开发规划中，它将基于 `Tailwind CSS` 进行重写，届时新仓库和配套的文档、演示程序也会陆续推出。

组件逻辑复用是很难啃的一块骨头，但我实在不希望使用 Vue 写的组件逻辑在我使用 Angular 实现相同组件的时候还得重写一遍，这也是最初看到 Web Components 就选择采用 Omi 的原因之一。冲动过后，发现 Web Components 前景其实并不十分明朗，当前的考虑是逐步将组件的核心通用逻辑提取为 Utils 组件工具库，以便在不同框架中复用。

## 开发（Developing）

> 开发部分是 Thoughts Lab 架构最为核心的部分。

在使用 uni-app 开发完成第一版之后，回顾代码，面临着三个主要的问题：

- async 传染的问题泛滥至应用的每一个角落；
- 为了隔离子应用之间和页面之间的状态， 使用 vuex 作为状态管理方案将应用和页面对应的 Store 层层嵌套过于繁琐；
- 虽说大部分业务逻辑做了单独的 Module 组织，但页面中充斥的业务代码还是难以完全提取出去，数据绑定、视图交互、业务逻辑全部在 SFC 中，混乱不堪。

考虑到对于 Thoughts Lab 未来的期待，我决定推倒重构。先对这次重构进行一个简单的介绍：

- 此次重构较上个版本而言最关键的变更是引入了 RxJS，解决掉 async 传染问题的同时，**几乎整个应用程序完全变成了异步**；
- 主要采用了传统的分层架构方案，业务逻辑全部在分层中完成，在最顶层将必要的数据和接口暴露给页面，框架（Vue）只要从业务层将数据和接口导入，与视图完成对接即可；
- 业务逻辑单独提取解决了跨框架迁移复用的问题，分层也在一定程度上缓解了异步的可控性问题；
- 使用 Repository、Usecase、Domain、Service、Entity、Module、Presenter 等概念（扁平地体现在项目的同名子目录中），对业务处理的责任进行了具化；

总地来说，开发部分总共分为四层，自下而上分别是 Data、Domain、Services、Presenter，最底层的 Data 层封装服务端原生 API，层层处理之后由 Presenter 向 Page 暴露业务数据和接口。

> 这是一个通用型的结构，不与任何框架绑定，层与层之间的依赖耦合也尽可能降低，于此实现**业务逻辑的完整跨框架复用**同时也保持每一层的可替换性。

### Data

所有来自服务端的接口必须全部通过 Data 层的处理，封装为 Promise 导出给下一层。很多时候应用的数据并非来自统一的服务端，可进行分类处理，例如 Thoughts Lab 同时使用了知晓云和微信小程序云开发的资源，此外还考虑到应用数据的运行时统一管理和个别业务数据的持久化本地存储，于是 Data 目录划分为如下：

```
| - Data
	| - ifanr-server
	| - local-storage
	| - storage
	| - wx-server
```

如果业务接口繁多，还可以考虑在服务端目录下再按照业务或者其它合理的方式进行接口的归类，便于管理和引用。

> Data 层进行的主要工作就是 `API -> Promise`，抹平服务端接口的调用差异，同时将本地存储和缓存操作封装为接口，保持后续作为“数据源”调用的一致性。

### Domain

Domain 层在 Data 层之后，是统一管理各个数据源的地方，Data 层导出的 Promise 会按照所属的业务领域汇总至不同的 Repository 中，同时 Promise 将转换为 Observable。

业务方面，这一层**主要负责在经手服务端数据的同时管理好应用运行时存储和本地存储，即将特定的数据做好缓存**。除此之外，不做其它处理，这也意味着 Repository 并不能直接开放给外部引用。

在 Repository 之上，Usecase（用例）作为数据源到具体业务的缓冲层，负责组织较为原始的数据接口，转换为可直接被应用使用的较为复杂的数据或方法，包括处理数据的格式转换、组合、筛选等。最终向外界开放的，正是一个个 Usecase。

> Domain 层接受 Data 层的 Promise，最终开放 Usecase 作为后续应用的基本单元，数据接口类型为 Observable 或 Function。

### Services

Services 是业务最重的一层，导入 Domain 暴露的用例，将他们组织成 Service。一般来说，每个 Service 均包含着最为核心的业务处理，Service 对外开放的部分，正是核心业务的数据和接口，将这些数据和接口对接到视图中之后，应用便可以成功运行了。所以，此处也是开发的重中之重。

Service 划分的最大依据就是业务的相关程度，以 Thoughts Lab 为例，当前有 4 个 Service，分别实现了不同业务功能的核心逻辑：

```
| - services
	| - changelog.service.js
	| - poster.service.js
	| - public.service.js
	| - user.service.js
```

其中 `user.service.js` 是通用的服务模块，包含了用户信息等内容，`poster.service.js` 承载了 Poster 子应用（Thoughts Lab 当前唯一的应用）的几乎所有核心逻辑，这包括新旧 poster 的加载、myposter 的加载、发布和删除 poster 以及所有业务操作之间的联动，虽然繁杂，但得益于 RxJS 提供的描述式的数据流开发方式，不再需要命令式地检查和处理分布在不同页面之间地业务联动和状态管理，完成 poster 应用所有的核心逻辑仅用了 **120** 行代码！

> **特别注意**：`public.service.js` 并不针对某一单独的应用级业务，实现它的原因是使各层之间的引用和依赖关系保持稳定，尽量不出现特殊情况。

### Presenter

页面的呈现与应用核心并不是完美契合的，很多时候，页面的正常运作，往往需要多个服务的参与，我们希望页面中只包含业务数据和用户操作接口的对接，以此尽可能降低业务和视图的耦合。Presenter 层的任务就是将来自视图的用户操作、页面涉及的多个服务进行组合，同时也处理一些关于操作体验、视觉体验优化的额外计算工作。SFC 中需要做的就是在初始化的时候订阅好数据源并做绑定，将用户操作的事件转接至 Presenter 对应的操作接口，在页面销毁的时候调用准备好的方法销毁订阅，如此简单。

每一个 Page 都必然对应着一个 Presenter，Presenter 层的目录结构与页面的目录结构是完全对应的。作为一个包含多个子应用的应用，目录结构一般是这样的：

```
| - pages(presenter)
  | - index // 首页，一般是一个多应用功能的聚合页，可导航至子应用
  | - poster // 子应用
  	| - poster
  	| - myposter
  	| - publish
  | - public // 公共页面，比如个人主页、About、Changelog……
  	| - changelog
  	| - profile
  	| - verify
```

### 其它

以上分别介绍了每一层的大致结构和功能，在具体实现中，每一层还有更加详细、深入的规范和原则，比如：

- 在任何一层中，层内的模块都不允许互相调用；
- 在层间，依赖只能是自上而下的，底层实现不依赖上层业务，且不允许跨层调用；
- 依赖是面向接口的，而不是面向具体实现的；

- Domain 内部其实分为两层，子应用相关的 Repository 之下，是系统级的 Repository，包含了用户信息、应用配置项等；
- Data 和 Repository 层的配置项，只能由 Service 层自下而上调用而后自上而下注入；
- 配置项最高传递至 Presenter 层，且 Presenter 层不允许使用业务相关的配置，只能使用视图相关的配置，比如页面标题、布局代码、主题颜色等；
- ……

> 当上述实现都更加成熟之后，会单独开辟文档对每一层进行详细的介绍和说明。

## 服务（Server）

服务使用的是[微信小程序云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)和[知晓云](https://cloud.minapp.com/)，云开发的数据库是 NoSQL 型的，适合作为无结构型数据的存储容器，目前 Thoughts Lab 的配置文件就是使用云开发的数据库存储的。

知晓云作为第三方云服务提供商，为开发者提供了数据存储、内容存储、文件存储、多方登录、用户管理、支付接口、模板推送、客服消息等接口，可以通过官方 SDK 调用，并且 SDK 抹平了不同平台（微信小程序、支付宝小程序、QQ 小程序、百度小程序、Web、iOS、Android）的差异以实现几近无缝的跨端使用。目前 Thoughts Lab 的 Poster 应用数据以及 Changelog 数据都是存储在知晓云上的。

> 知晓云将长久地作为 Thoughts Lab 的数据统一平台，而各个平台特定的子应用和配置，将由各个平台提供的云开发服务所承载，相通的数据以知晓云为中介。




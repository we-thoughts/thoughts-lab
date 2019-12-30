# 开发计划(todos)

此处记录 Thoughs Lab 的所有**开发**安排，所有开发任务都分为 PROPOSAL -> TODO -> DOING -> DONE 四个阶段。具体地，每项改动都必须先提交 `提案` (PROPOSAL)，经过审核之后列入 `APPROVED` (已批准)， 并排入 `待办` (TODO)，每项正在进行的工作都会实时登记在 `进行中` (DOING)，完成之后归置到 `已完成` (DONE)中。

一般来说，开发任务及对应的类型代码如下：新功能(feature), 修复BUG(bugfix), 文档(docs), 架构改动(architecture)...

## PROPOSAL

- 201912201510-cigaret-architecture: 统一状态传递的参数(args)格式(xxxx_xxxx_states$.next(args))
  - desc: 状态流参数传递格式混乱，开发时需要频繁在上下文跳转查看参数格式，亟需统一，也便于之后接入 TypeScript
- 201912201629-cigaret-feature: 接入腾讯内容审核接口
  - desc: 为了 Thoughts Lab 的健康发展，需要遵守平台方的规定，涉及信息发布的小程序应该接入腾讯提供的内容审核接口
  - subtodo:
    - `Data > wx-server` 封装审核接口 -> PosterRepository -> Usecase
    - ...

## TODO

## DOING

## DONE

- [x] 201912201459-cigaret-docs: 示例，提案格式为 → "yyyymmddhhss-name-type: content"
  - [x]头部介绍
  - [x]示例编写

## APPROVED

- 201912201459-cigaret-docs: 示例，提案格式为 → "yyyymmddhhss-name-type: content"
  - desc: 按照既定的标准管理开发计划
  - subtodo:
    - 开发计划标准介绍
    - 各阶段记录模板编写

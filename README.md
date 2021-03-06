# SITAR-ADMIN

![](https://github.com/harrisoff/sitar-admin/workflows/build/badge.svg)

[小程序【西塔尔之声】](https://github.com/harrisoff/sitar)的后台管理系统。

Serverless 架构。静态页面托管在 GitHub Pages，接口全部为微信 API，使用 Cloudflare Workers 做反向代理。

[地址](https://harrisoff.github.io/sitar-admin.html)

> 不过只有我的 APPID 和 SECRET 才能登录 😎

## 部署

修改非源码文件时也会触发 actions，由于构建产物没有变化，导致在 github pages 的 repo 执行 `git commit` 时报错 `nothing to commit, working tree clean`，从而构建失败。

所以使用 `deploy.sh` 脚本根据 `git status -sb` 的输出来判断是否需要更新 repo。

## TODO

- [ ] 文章手动排序
- [ ] 日志重构
   - [x] level 为 error 时页面渲染报错
   - [x] 时间线概览
   - [ ] 登录日志
   - [ ] 文章日志
   - [ ] 随机功能日志
   - [ ] 搜索关键词日志
   - [ ] 设备类型统计

### 有空再搞

- [ ] 文件管理
- [ ] 书和文章怎么设置外键比较好？
- [ ] article 表 list 字段名改为 is_latest，top 改为 is_top
- [ ] 时区 - 好像没问题
- [ ] 根据 real_id 重新同步对应的单条图文素材

### 搞不定

- [ ] 聚合时怎么分页？？

### 完成

- [x] 后台有些云函数可以改为联表查询
- [x] 【重要】增量同步功能
- [x] 不需要维护一个 wx_material 表
- [x] 修改同步流程，同步时不做任何解析操作，html 的解析改为添加文章时进行
- [x] 取消 query get 的基本封装，没必要
- [x] get()/end() 时删掉不需要的字段可以明显提升查询速度
- [x] 不请求接口，使用 wx_news 的数据重新设置 article 的 html/text
- [x] 后台有些接口需要分页
- [x] 如果有必要，接口显式指定排序方式
- [x] 文章的显示/隐藏应该在文章页管理，而不是素材页
- [x] 表格添加筛选条件
- [x] 重解析 BUG
- [x] 研究一下音频上传到微信后台和云开发后台哪个比较合适
- [x] 专辑管理
- [x] 通知
- [x] 取消备份功能
- [x] 使用 appid 和 secret 登录
- [x] 上传图片时报错没有获取 token 或 token 无效

## 微信 API

[接口调用次数上限](https://developers.weixin.qq.com/community/develop/doc/000aaca7e788d07404480e8615ec00)



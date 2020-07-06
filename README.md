# SITAR-ADMIN

![](https://github.com/harrisoff/sitar-admin/workflows/build/badge.svg)

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

## 微信 API

[接口调用次数上限](https://developers.weixin.qq.com/community/develop/doc/000aaca7e788d07404480e8615ec00)

### 返回值格式

云函数接口返回值格式
```js
const { result, errMsg, requestID } = response
const { errCode, errMsg, requestID } = error
```

公众号接口返回值格式
```js
const { errMsg } = error
```
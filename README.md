# SITAR-ADMIN

## TODO

- [ ] 文章排序
- [ ] 取消备份功能
- [ ] 后台有些接口需要分页
- [ ] 所有列表接口显式指定排序方式

- [ ] 书和文章怎么设置外键比较好？
- [ ] 聚合时怎么分页？？
- [ ] article 表 list 字段名改为 is_latest，top 改为 is_top

- [x] 后台有些云函数可以改为联表查询
- [x] 【重要】增量同步功能
- [x] 不需要维护一个 wx_material 表
- [x] 修改同步流程，同步时不做任何解析操作，html 的解析改为添加文章时进行
- [x] 取消 query get 的基本封装，没必要
- [x] get()/end() 时删掉不需要的字段可以明显提升查询速度
- [x] 不请求接口，使用 wx_news 的数据重新设置 article 的 html/text

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
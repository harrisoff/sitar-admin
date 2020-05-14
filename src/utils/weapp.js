// 傻逼云开发数据库
// https://developers.weixin.qq.com/community/develop/doc/0004e6a5d24dc018c0e887f8d5b400
export function escapeHtml(text) {
  text = text.replace(/\\"/g, '\\\\"');
  text = text.replace(/\\n/g, "\\\\n");
  // TODO: 看看还有没有别的地方没有转义
  return text;
}

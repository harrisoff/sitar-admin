// local storage
const SESSION_STORAGE_KEYS = {
  MINI_TOKEN: "token-mini",
  WX_TOKEN: "token-wx"
};

// 公众号 & 小程序 通用
const AUTH_SERVER = "https://api.weixin.qq.com/cgi-bin";

// 公众号
const WX_API_SERVER = "https://api.weixin.qq.com/cgi-bin";

// 小程序
// 云开发
const ENV = {
  N10: process.env.VUE_APP_N10,
  N4: process.env.VUE_APP_N4,
  CLOUD_ENV: process.env.VUE_APP_CLOUD_ENV
};
const MINI_API_SERVER = "https://api.weixin.qq.com/tcb";
const MINI_UPLOAD_SERVER = "https://cos.ap-shanghai.myqcloud.com/";
const MINI_STATIC_SERVER = `https://${ENV.N4}-${ENV.CLOUD_ENV}-${ENV.N10}.tcb.qcloud.la`;
// 数据库
const COLLECTIONS = {
  SETTING: "setting",
  LOG: "log",
  // 原始素材
  VOICE_RAW: "wx_voice",
  IMAGE_RAW: "wx_image",
  VIDEO_RAW: "wx_video",
  NEWS_RAW: "wx_news",

  COMMENT: "comment",
  USER: "user",
  FILE: "file",
  ARTICLE: "article",
  BOOK: "book",
  SONG: "song",
  ALBUM: "album",
  NOTICE: "notice"
};
// 文件存储路径
// 虽然是根路径，但是不能以 / 开头
const STORAGE = {
  BOOK_COVER: "book/cover", // 图片路径
  SONG: "song/file",
  ALBUM_COVER: "song/cover"
};
// 云函数

module.exports = {
  SESSION_STORAGE_KEYS,
  //
  AUTH_SERVER,
  //
  WX_API_SERVER,
  //
  ENV,
  MINI_API_SERVER,
  MINI_UPLOAD_SERVER,
  MINI_STATIC_SERVER,
  //
  COLLECTIONS,
  STORAGE
};

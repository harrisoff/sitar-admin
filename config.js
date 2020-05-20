// local storage
const LOCAL_STORAGE_KEYS = {
  MINI_TOKEN: "mini-token",
  WX_TOKEN: "wx-token",
  LAST_BACKUP: "last-backup"
};

// 公众号 & 小程序 通用
const AUTH_SERVER = "https://api.weixin.qq.com/cgi-bin";

// 公众号
const WX_APPID = "wx98908bfb76102166";
const WX_APPSECRET = "9ebe8100bded82824f16598853dcd483";
const WX_API_SERVER = "https://api.weixin.qq.com/cgi-bin";

// 小程序
const MINI_APPID = "wx61a34a8985cea189";
const MINI_APPSECRET = "b6d293b83239961dd65a1f5b6b792e86";
// 云开发
const PROCESS_ENV = "dev";
const N10 = "1302052182";
const DEV_ENV = {
  N4: "7369", // ???
  CLOUD_ENV: "sitar-dev"
};
const PROD_ENV = {
  N4: "",
  CLOUD_ENV: ""
};
const ENV = {
  N10,
  N4: PROCESS_ENV === "dev" ? DEV_ENV.N4 : PROD_ENV.N4,
  CLOUD_ENV: PROCESS_ENV === "dev" ? DEV_ENV.CLOUD_ENV : PROD_ENV.CLOUD_ENV
};
const MINI_API_SERVER = "https://api.weixin.qq.com/tcb";
const MINI_UPLOAD_SERVER = "https://cos.ap-shanghai.myqcloud.com/";
const MINI_STATIC_SERVER = `https://${ENV.N4}-${ENV.CLOUD_ENV}-${ENV.N10}.tcb.qcloud.la`;
// 数据库
const COLLECTIONS = {
  BACKUP: "backup",
  SETTING: "setting",
  LOG: "log",
  // 原始素材
  VOICE_RAW: "wx_voice",
  IMAGE_RAW: "wx_image",
  VIDEO_RAW: "wx_video",
  NEWS_RAW: "wx_news",
  // 需要备份的
  COMMENT: "comment",
  USER: "user",
  FILE: "file",
  ARTICLE: "article",
  BOOK: "book"
};
// 文件存储路径
// 虽然是根路径，但是不能以 / 开头
const STORAGE = {
  BOOK_COVER: "book/cover", // 图片路径
  SONG: "song/file",
  ALBUM_COVER: "song/cover",
  BACKUP: "backup" // 备份文件
};
// 云函数

module.exports = {
  LOCAL_STORAGE_KEYS,
  //
  AUTH_SERVER,
  //
  WX_APPID,
  WX_APPSECRET,
  WX_API_SERVER,
  //
  MINI_APPID,
  MINI_APPSECRET,
  ENV,
  MINI_API_SERVER,
  MINI_UPLOAD_SERVER,
  MINI_STATIC_SERVER,
  //
  COLLECTIONS,
  STORAGE
};

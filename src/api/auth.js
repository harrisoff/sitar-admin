import request from "./request";
import {
  WX_APPID,
  WX_APPSECRET,
  MINI_APPID,
  MINI_APPSECRET,
  LOCAL_STORAGE_KEYS
} from "../../config";

// ======== 授  权 ========
// 获取公众号/小程序的 access_token
export function getAccessToken(type) {
  let appid, secret, tokenKey;
  if (type === "wx") {
    appid = WX_APPID;
    secret = WX_APPSECRET;
    tokenKey = LOCAL_STORAGE_KEYS.WX_TOKEN;
  } else {
    //
    appid = MINI_APPID;
    secret = MINI_APPSECRET;
    tokenKey = LOCAL_STORAGE_KEYS.MINI_TOKEN;
  }
  // 如果本地有还没过期的 token，就用本地的
  const localRecord = localStorage.getItem(tokenKey);
  if (localRecord) {
    const { expireTime } = JSON.parse(localRecord);
    if (expireTime > new Date().getTime()) {
      return Promise.resolve("token 未过期");
    }
  }
  // 本地 token 过期
  return new Promise((resolve, reject) => {
    request({
      url: `/token?grant_type=client_credential&appid=${appid}&secret=${secret}`,
      method: "get"
    })
      .then(data => {
        const { access_token, expires_in } = data;
        const record = {
          // 7200s/2h 内有效，这里减半小时缓冲
          expireTime: new Date().getTime() + ((expires_in * 3) / 4) * 1000,
          accessToken: access_token
        };
        localStorage.setItem(tokenKey, JSON.stringify(record));
        resolve("token 获取成功");
      })
      .catch(reject);
  });
}

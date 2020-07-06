import request from "./request";
import { SESSION_STORAGE_KEYS } from "../../config";

import { setToken } from "../utils/session";

const { WX_TOKEN, MINI_TOKEN } = SESSION_STORAGE_KEYS;

function getToken(appid, secret, type) {
  return new Promise((resolve, reject) => {
    request({
      url: `/token?grant_type=client_credential&appid=${appid}&secret=${secret}`,
      method: "get"
    })
      .then(data => {
        const { access_token, expires_in } = data;
        const record = {
          // 7200s/2h 内有效，这里减半小时缓冲
          // expireTime 暂时没用到
          expireTime: new Date().getTime() + ((expires_in * 3) / 4) * 1000,
          accessToken: access_token
        };
        const tokenKey = type === "wx" ? WX_TOKEN : MINI_TOKEN;
        setToken(tokenKey, JSON.stringify(record));
        resolve(access_token);
      })
      .catch(reject);
  });
}

export function getWxToken(appid, secret) {
  return getToken(appid, secret, "wx");
}

export function getMiniToken(appid, secret) {
  return getToken(appid, secret, "mini");
}

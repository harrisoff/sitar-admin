import axios from "axios";

import router from "../router";
import { getWxToken, getMiniToken, delMiniToken } from "../utils/session";

const service = axios.create({
  withCredentials: true,
  timeout: 15 * 1000 // 上传文件的时候会慢一点
});

service.interceptors.request.use(
  config => {
    // content-type
    if (config.url.indexOf("/myUpload") === -1) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // formdata
    }

    // 获取 token 的接口不需要 url 拼接 access_token
    if (config.url.indexOf("/token") === 0) {
      return config;
    }

    if (!config.params) config.params = {};

    const isMiniApi = config.url.indexOf("/mini-api") === 0;
    const record = isMiniApi ? getMiniToken() : getWxToken();
    if (record) {
      config.params.access_token = JSON.parse(record).accessToken;
    }
    // 没有 token
    else {
      // 没有小程序的 token
      // 刷新一下，导航守卫会跳转到登录页
      if (isMiniApi) {
        location.reload();
      }
      // 没有公众号的 token
      else {
        return Promise.reject("没有获取 token 或 token 无效");
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;
    const url = response.config.url;

    // /myUpload 返回 204，res 为空
    if (url.indexOf("/myUpload") === 0) {
      return res;
    }

    // /token 接口不返回 errcode
    const { errcode, errmsg } = res;
    if (errcode === undefined || errcode === 0) {
      return res;
    } else {
      // token 过期
      if (errcode === 40001 && url.indexOf("/mini-api") === 0) {
        delMiniToken();
        // 不要 reload，否则提示会消失
        router.push("/login");
        return Promise.reject(errmsg);
      }
      // 其他错误
      else {
        return Promise.reject(errmsg);
      }
    }
  },
  error => {
    // timeout 会在这里报错
    // request interceptor return Promise.reject() 也会被这里捕捉到
    let errMsg = error;
    // axios 原生 error 带有 toJSON 方法
    if (error.toJSON) {
      const errorJson = error.toJSON();
      errMsg = errorJson.message;
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
);

export default service;

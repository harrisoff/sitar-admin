import axios from "axios";
import { Message } from "element-ui";
import { LOCAL_STORAGE_KEYS } from "../../config";

const service = axios.create({
  withCredentials: true, // TODO: send cookies when cross-domain requests
  timeout: 15000 // 上传文件的时候会慢一点
});

// request interceptor
service.interceptors.request.use(
  config => {
    // content-type
    if (config.url.indexOf("/myUpload") === -1) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // formdata
    }

    if (config.url.indexOf("/token") === 0) {
      return config;
    }

    // access-token
    let tokenKey;
    // 微信接口
    if (config.url.indexOf("/wx-api") === 0) {
      tokenKey = LOCAL_STORAGE_KEYS.WX_TOKEN;
    }
    // 小程序接口
    else {
      tokenKey = LOCAL_STORAGE_KEYS.MINI_TOKEN;
    }
    if (!config.params) config.params = {};
    try {
      const record = localStorage.getItem(tokenKey);
      config.params.access_token = JSON.parse(record).accessToken;
    } catch (err) {
      Message({
        message: "没有获取 token 或 token 无效",
        type: "error",
        duration: 3000
      });
      return Promise.reject("没有获取 token 或 token 无效");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    // /myUpload 返回 204，res 为空
    if (response.config.url.indexOf("/myUpload") === 0) {
      return res;
    }

    // /token 接口不返回 errcode
    const { errcode, errmsg } = res;
    if (errcode === undefined || errcode === 0) {
      return res;
    } else {
      if (errcode === 42001) {
        return Promise.reject(errmsg);
      } else {
        return Promise.reject(errmsg);
      }
    }
  },
  error => {
    // timeout 会在这里报错
    console.error(error); // for debug
    // const { data, status, headers } = error.response;
    // request interceptor return Promise.reject() 也会被这里捕捉到
    // Message({
    //   message: error.message,
    //   type: "error",
    //   duration: 3000
    // });
    return Promise.reject(error);
  }
);

export default service;

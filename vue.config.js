const {
  AUTH_SERVER,
  WX_API_SERVER,
  MINI_UPLOAD_SERVER,
  MINI_API_SERVER,
  MINI_STATIC_SERVER
} = require("./config");

module.exports = {
  devServer: {
    proxy: {
      // 公众号 & 小程序 通用
      "/token": {
        target: AUTH_SERVER,
        changeOrigin: true
      },
      // 微信
      "/wx-api": {
        target: WX_API_SERVER,
        changeOrigin: true,
        pathRewrite: {
          "^/wx-api": "/"
        }
      },
      // 小程序
      "/myUpload": {
        target: MINI_UPLOAD_SERVER,
        changeOrigin: true,
        pathRewrite: {
          "^/myUpload": "/"
        }
      },
      "/mini-api": {
        target: MINI_API_SERVER,
        changeOrigin: true,
        pathRewrite: {
          "^/mini-api": "/"
        }
      },
      "/static": {
        target: MINI_STATIC_SERVER,
        changeOrigin: true,
        pathRewrite: {
          "^/static": "/"
        }
      }
    }
  }
};
